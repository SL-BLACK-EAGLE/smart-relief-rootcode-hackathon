#!/usr/bin/env bash
set -euo pipefail

# Configurable parameters
: "${DOCKER_USER:=slblackeagle}"
: "${DOCKER_TAG:=dev}"
# Set to 1 to push images to Docker Hub (requires docker login)
: "${DOCKER_PUSH:=0}"
# Toggle TLS via cert-manager for local nip.io host. Default off to avoid CRD dependency.
: "${TLS_ENABLE:=0}"
# Set to 1 if you will run `minikube tunnel` and want 127.0.0.1 based host
: "${INGRESS_LOOPBACK:=0}"
# Fast-mode toggles to speed up local runs
: "${SKIP_BUILD:=0}"
: "${SKIP_EXTRAS:=0}"
: "${SKIP_MONITORING:=0}"
: "${SKIP_ROLLOUT_WAIT:=0}"
: "${TIMEOUT:=120}"
: "${SKIP_INGRESS_ENABLE:=0}"
# Force local port-forward access instead of Ingress/NodePort (helpful on Windows)
: "${PF_MODE:=0}"
# Also port-forward dashboards/tools to localhost (Grafana, Prometheus, Kibana, etc.)
: "${PF_DASHBOARDS:=0}"

# Use Minikube's Docker daemon so images are local to the cluster
minikube -p minikube docker-env --shell bash > /tmp/mk_env.sh
source /tmp/mk_env.sh

if [ "${SKIP_BUILD}" = "1" ]; then
	echo "[build] Skipping image builds (SKIP_BUILD=1)"
else
	echo "[build] Building backend (production target)"
	docker build -t smartrelief/backend:dev -f packages/backend/Dockerfile --target production .

	echo "[build] Building ai-service (production target)"
	docker build -t smartrelief/ai-service:dev -f packages/ai-service/Dockerfile --target production packages/ai-service
fi

# Tag for Docker Hub
echo "[docker] Tagging images for Docker Hub user: ${DOCKER_USER}"
docker tag smartrelief/backend:dev "${DOCKER_USER}/smartrelief-backend:${DOCKER_TAG}"
docker tag smartrelief/ai-service:dev "${DOCKER_USER}/smartrelief-ai-service:${DOCKER_TAG}"

if [ "${DOCKER_PUSH}" = "1" ]; then
	echo "[docker] Pushing images to Docker Hub"
	docker push "${DOCKER_USER}/smartrelief-backend:${DOCKER_TAG}"
	docker push "${DOCKER_USER}/smartrelief-ai-service:${DOCKER_TAG}"
fi

# Enable NGINX Ingress addon (if not already)
if [ "${SKIP_INGRESS_ENABLE}" = "1" ]; then
	echo "[k8s] Skipping ingress addon enable (SKIP_INGRESS_ENABLE=1)"
else
	echo "[k8s] Ensuring ingress addon is enabled"
	minikube addons enable ingress || true
fi

# Apply core manifests (no ingress)
echo "[k8s] Applying core resources (namespace, db, cache, services, deployments)"
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl apply -f infrastructure/kubernetes/postgres.yaml
kubectl apply -f infrastructure/kubernetes/redis.yaml
kubectl apply -f infrastructure/kubernetes/app-config.yaml
kubectl apply -f infrastructure/kubernetes/backend.yaml
kubectl apply -f infrastructure/kubernetes/ai-service.yaml
if [ "${SKIP_EXTRAS}" != "1" ]; then
	kubectl apply -f infrastructure/kubernetes/elasticsearch.yaml
	kubectl apply -f infrastructure/kubernetes/kibana.yaml
	kubectl apply -f infrastructure/kubernetes/jaeger.yaml
	kubectl apply -f infrastructure/kubernetes/minio.yaml
	kubectl apply -f infrastructure/kubernetes/mailhog.yaml
	kubectl apply -f infrastructure/kubernetes/pgadmin.yaml
	kubectl apply -f infrastructure/kubernetes/redis-commander.yaml
else
	echo "[k8s] Skipping extras (Elasticsearch/Kibana/Jaeger/MinIO/Mailhog/pgAdmin/Redis Commander)"
fi

if [ "${SKIP_ROLLOUT_WAIT}" = "1" ]; then
	echo "[k8s] Skipping rollout waits (SKIP_ROLLOUT_WAIT=1)"
else
	echo "[k8s] Waiting for core rollouts (timeout=${TIMEOUT}s)"
	kubectl -n smartrelief rollout status deploy/backend --timeout=${TIMEOUT}s || true
	kubectl -n smartrelief rollout status deploy/ai-service --timeout=${TIMEOUT}s || true
	kubectl -n smartrelief rollout status deploy/redis --timeout=${TIMEOUT}s || true
	kubectl -n smartrelief rollout status statefulset/postgres --timeout=${TIMEOUT}s || true
fi

# Wait for ingress controller
if [ "${SKIP_ROLLOUT_WAIT}" = "1" ]; then
	echo "[k8s] Skipping ingress controller wait (SKIP_ROLLOUT_WAIT=1)"
else
	echo "[k8s] Waiting for ingress-nginx controller (timeout=${TIMEOUT}s)"
	kubectl -n ingress-nginx rollout status deploy/ingress-nginx-controller --timeout=${TIMEOUT}s || true
fi

# Apply ingress manifests
echo "[k8s] Applying ingress resources"
kubectl apply -f infrastructure/kubernetes/ingress-backend.yaml
kubectl apply -f infrastructure/kubernetes/ingress-ai.yaml
kubectl apply -f infrastructure/kubernetes/ingress-extras.yaml

# Apply HPAs
echo "[k8s] Applying HPAs"
kubectl apply -f infrastructure/kubernetes/hpa.yaml

# Monitoring stack
if [ "${SKIP_MONITORING}" != "1" ]; then
	echo "[k8s] Applying monitoring (Prometheus & Grafana)"
	kubectl apply -f infrastructure/kubernetes/monitoring.yaml
else
	echo "[k8s] Skipping monitoring (SKIP_MONITORING=1)"
fi

# Patch deployments to use Docker Hub images (works whether or not you pushed)
echo "[k8s] Setting deployment images to Docker Hub tags"
kubectl -n smartrelief set image deploy/backend backend="${DOCKER_USER}/smartrelief-backend:${DOCKER_TAG}" --record=true
kubectl -n smartrelief set image deploy/ai-service ai-service="${DOCKER_USER}/smartrelief-ai-service:${DOCKER_TAG}" --record=true

# Configure Ingress host using nip.io to avoid hosts-file edits
IP=$(minikube ip)
if [ "${INGRESS_LOOPBACK}" = "1" ]; then
	HOST="127-0-0-1.nip.io"
else
	HOST="${IP//./-}.nip.io"
fi

echo "[k8s] Patching Ingress hosts to ${HOST}"
kubectl -n smartrelief patch ingress backend-ingress --type=json \
	-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${HOST}\"}]"
kubectl -n smartrelief patch ingress ai-ingress --type=json \
	-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${HOST}\"}]"

if [ "${TLS_ENABLE}" = "1" ]; then
	# Issue a self-signed TLS cert for the chosen host (requires cert-manager installed)
	echo "[k8s] Ensuring cert-manager Issuer and Certificate for ${HOST}"
	set +e
	kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
	name: selfsigned-issuer
	namespace: smartrelief
spec:
	selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
	name: smartrelief-local-cert
	namespace: smartrelief
spec:
	secretName: smartrelief-local-tls
	duration: 8760h
	renewBefore: 360h
	commonName: ${HOST}
	dnsNames:
		- ${HOST}
	issuerRef:
		name: selfsigned-issuer
		kind: Issuer
EOF
	kubectl -n smartrelief patch ingress backend-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/tls/0/hosts/0\",\"value\":\"${HOST}\"}]" || true
	kubectl -n smartrelief patch ingress ai-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/tls/0/hosts/0\",\"value\":\"${HOST}\"}]" || true
	set -e
		SCHEME="https"
		CURL_FLAGS="-sk"
else
	echo "[k8s] Disabling TLS for local ingress (HTTP only)"
	kubectl -n smartrelief patch ingress backend-ingress --type=json \
		-p='[{"op":"remove","path":"/spec/tls"}]' || true
	kubectl -n smartrelief patch ingress ai-ingress --type=json \
		-p='[{"op":"remove","path":"/spec/tls"}]' || true
	SCHEME="http"
	CURL_FLAGS="-s"
fi

	# Determine how to reach ingress (NodePort vs LoadBalancer)
	INGRESS_SVC="ingress-nginx-controller"
	SVC_TYPE=$(kubectl -n ingress-nginx get svc ${INGRESS_SVC} -o jsonpath='{.spec.type}')
	HTTP_NODEPORT=$(kubectl -n ingress-nginx get svc ${INGRESS_SVC} -o jsonpath='{.spec.ports[?(@.name=="http")].nodePort}')
	HTTPS_NODEPORT=$(kubectl -n ingress-nginx get svc ${INGRESS_SVC} -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')

	if [ "${INGRESS_LOOPBACK}" = "1" ]; then
		echo "[k8s] Switching ingress service to LoadBalancer for loopback access (requires: minikube tunnel)"
		kubectl -n ingress-nginx patch svc ${INGRESS_SVC} -p '{"spec":{"type":"LoadBalancer"}}' >/dev/null 2>&1 || true
		printf "\nAccess URL (start: minikube tunnel):\n"
		printf "%s://%s\n\n" "$SCHEME" "$HOST"
		DISPLAY_BASE="$SCHEME://$HOST"
	else
		# Use NodePort with nip.io host
		if [ "$SCHEME" = "https" ]; then
			PORT="$HTTPS_NODEPORT"
		else
			PORT="$HTTP_NODEPORT"
		fi
		printf "\nAccess URL (NodePort; no tunnel needed):\n"
		printf "%s://%s:%s\n\n" "$SCHEME" "$HOST" "$PORT"
		DISPLAY_BASE="$SCHEME://$HOST:$PORT"
	fi

	printf "Smoke tests:\n"
	if [ "${INGRESS_LOOPBACK}" = "1" ]; then
		echo "# run: minikube tunnel (in another terminal)"
		echo "curl $CURL_FLAGS -I $SCHEME://$HOST/health"
		echo "curl $CURL_FLAGS -I $SCHEME://$HOST/ai/health"
		echo "curl $CURL_FLAGS $SCHEME://$HOST/api/government-services | head -n 20"
	else
		echo "curl $CURL_FLAGS -H 'Host: $HOST' -I $SCHEME://$IP:$PORT/health"
		echo "curl $CURL_FLAGS -H 'Host: $HOST' -I $SCHEME://$IP:$PORT/ai/health"
		echo "curl $CURL_FLAGS -H 'Host: $HOST' $SCHEME://$IP:$PORT/api/government-services | head -n 20"
	fi

	# If NodePort ingress isn't reachable (or PF_MODE=1), fall back to local port-forwarding for core APIs
	NEED_PF=0
	if [ "$PF_MODE" = "1" ]; then
		NEED_PF=1
	elif [ "${INGRESS_LOOPBACK}" = "1" ]; then
		# In loopback mode we rely on minikube tunnel and LoadBalancer; skip NodePort probe
		NEED_PF=0
	else
		# quick probe with short timeout (NodePort)
		if ! curl -m 3 $CURL_FLAGS -H "Host: $HOST" "$SCHEME://$IP:$PORT/health" -I >/dev/null 2>&1; then
			NEED_PF=1
		fi
	fi

	if [ "$NEED_PF" = "1" ]; then
		printf "\n[dev] NodePort ingress not reachable or PF_MODE=1. Starting local port-forwards for APIs...\n"
		# Backend: localhost:8080 -> backend:3000
		kubectl -n smartrelief port-forward svc/backend 8080:3000 >/tmp/pf_backend.log 2>&1 & BPF_PID=$!
		# AI: localhost:8081 -> ai-service:8000
		kubectl -n smartrelief port-forward svc/ai-service 8081:8000 >/tmp/pf_ai.log 2>&1 & AIPF_PID=$!
		sleep 1
		printf "Local API endpoints (port-forward):\n"
		echo "Backend:  http://127.0.0.1:8080 (health: /health, API: /api, OpenAPI: /openapi)"
		echo "AI:       http://127.0.0.1:8081 (health: /health, docs: /docs, openapi: /openapi.json)"
		echo "PIDs -> backend: $BPF_PID, ai: $AIPF_PID (stop with: kill $BPF_PID $AIPF_PID)"
		printf "\nQuick curls:\n"
		echo "curl -I http://127.0.0.1:8080/health"
		echo "curl -I http://127.0.0.1:8081/health"

		# Optionally port-forward dashboards & tools as well
		if [ "${PF_DASHBOARDS}" = "1" ]; then
			printf "\n[dev] Starting local port-forwards for dashboards/tools...\n"
			get_port() { kubectl -n "$1" get svc "$2" -o jsonpath='{.spec.ports[0].port}' 2>/dev/null | tr -d '\r'; }
			pf() { ns="$1"; svc="$2"; lport="$3"; rport="$4"; kubectl -n "$ns" port-forward "svc/$svc" "$lport:$rport" >"/tmp/pf_${svc}.log" 2>&1 & echo $!; }

			# Determine remote ports (fallback to common defaults if query fails)
			GRAFANA_RPORT=$(get_port monitoring grafana);        : "${GRAFANA_RPORT:=3000}"
			PROM_RPORT=$(get_port monitoring prometheus);         : "${PROM_RPORT:=9090}"
			KIBANA_RPORT=$(get_port smartrelief kibana);          : "${KIBANA_RPORT:=5601}"
			JAEGER_RPORT=$(get_port smartrelief jaeger);          : "${JAEGER_RPORT:=16686}"
			MINIO_RPORT=$(get_port smartrelief minio);            : "${MINIO_RPORT:=9001}"
			MAILHOG_RPORT=$(get_port smartrelief mailhog);        : "${MAILHOG_RPORT:=8025}"
			PGADMIN_RPORT=$(get_port smartrelief pgadmin);        : "${PGADMIN_RPORT:=80}"
			REDIS_CMD_RPORT=$(get_port smartrelief redis-commander); : "${REDIS_CMD_RPORT:=8081}"
			ES_RPORT=$(get_port smartrelief elasticsearch);       : "${ES_RPORT:=9200}"

			# Local ports
			GRAFANA_LPORT=8300
			PROM_LPORT=9090
			KIBANA_LPORT=5601
			JAEGER_LPORT=16686
			MINIO_LPORT=9001
			MAILHOG_LPORT=8025
			PGADMIN_LPORT=5050
			REDIS_CMD_LPORT=8082
			ES_LPORT=9200

			GRAFANA_PID=$(pf monitoring grafana $GRAFANA_LPORT $GRAFANA_RPORT)
			PROM_PID=$(pf monitoring prometheus $PROM_LPORT $PROM_RPORT)
			KIBANA_PID=$(pf smartrelief kibana $KIBANA_LPORT $KIBANA_RPORT)
			JAEGER_PID=$(pf smartrelief jaeger $JAEGER_LPORT $JAEGER_RPORT)
			MINIO_PID=$(pf smartrelief minio $MINIO_LPORT $MINIO_RPORT)
			MAILHOG_PID=$(pf smartrelief mailhog $MAILHOG_LPORT $MAILHOG_RPORT)
			PGADMIN_PID=$(pf smartrelief pgadmin $PGADMIN_LPORT $PGADMIN_RPORT)
			REDIS_CMD_PID=$(pf smartrelief redis-commander $REDIS_CMD_LPORT $REDIS_CMD_RPORT)
			ES_PID=$(pf smartrelief elasticsearch $ES_LPORT $ES_RPORT)

			printf "\nLocal dashboards:\n"
			echo "Grafana:     http://127.0.0.1:$GRAFANA_LPORT"
			echo "Prometheus:  http://127.0.0.1:$PROM_LPORT"
			echo "Kibana:      http://127.0.0.1:$KIBANA_LPORT"
			echo "Jaeger:      http://127.0.0.1:$JAEGER_LPORT"
			echo "MinIO UI:    http://127.0.0.1:$MINIO_LPORT"
			echo "MailHog UI:  http://127.0.0.1:$MAILHOG_LPORT"
			echo "pgAdmin:     http://127.0.0.1:$PGADMIN_LPORT"
			echo "Redis Cmdr:  http://127.0.0.1:$REDIS_CMD_LPORT"
			echo "Elasticsearch: http://127.0.0.1:$ES_LPORT"

			printf "\nPIDs -> grafana:%s prometheus:%s kibana:%s jaeger:%s minio:%s mailhog:%s pgadmin:%s redis-cmd:%s elastic:%s\n" \
			  "$GRAFANA_PID" "$PROM_PID" "$KIBANA_PID" "$JAEGER_PID" "$MINIO_PID" "$MAILHOG_PID" "$PGADMIN_PID" "$REDIS_CMD_PID" "$ES_PID"
			printf "Stop with: kill %s %s %s %s %s %s %s %s %s\n" \
			  "$GRAFANA_PID" "$PROM_PID" "$KIBANA_PID" "$JAEGER_PID" "$MINIO_PID" "$MAILHOG_PID" "$PGADMIN_PID" "$REDIS_CMD_PID" "$ES_PID"
		fi
	fi

	# Patch extra ingress hosts to subdomains
	GRAFANA_HOST="grafana.${HOST}"
	PROM_HOST="prometheus.${HOST}"
	KIBANA_HOST="kibana.${HOST}"
	JAEGER_HOST="jaeger.${HOST}"
	MINIO_HOST="minio.${HOST}"
	MAILHOG_HOST="mailhog.${HOST}"
	PGADMIN_HOST="pgadmin.${HOST}"
	REDIS_CMDR_HOST="redis.${HOST}"
	ELASTIC_HOST="elasticsearch.${HOST}"

	kubectl -n monitoring patch ingress grafana-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${GRAFANA_HOST}\"}]" || true
	kubectl -n monitoring patch ingress prometheus-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${PROM_HOST}\"}]" || true
	kubectl -n smartrelief patch ingress kibana-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${KIBANA_HOST}\"}]" || true
	kubectl -n smartrelief patch ingress jaeger-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${JAEGER_HOST}\"}]" || true
	kubectl -n smartrelief patch ingress minio-console-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${MINIO_HOST}\"}]" || true
	kubectl -n smartrelief patch ingress mailhog-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${MAILHOG_HOST}\"}]" || true
	kubectl -n smartrelief patch ingress pgadmin-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${PGADMIN_HOST}\"}]" || true
	kubectl -n smartrelief patch ingress redis-commander-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${REDIS_CMDR_HOST}\"}]" || true
	kubectl -n smartrelief patch ingress elasticsearch-ingress --type=json \
		-p="[{\"op\":\"replace\",\"path\":\"/spec/rules/0/host\",\"value\":\"${ELASTIC_HOST}\"}]" || true

	printf "\nDashboards & tools (use Host header with NodePort, or tunnel):\n"
	echo "Grafana:     ${DISPLAY_BASE/"$HOST"/"$GRAFANA_HOST"}"
	echo "Prometheus:  ${DISPLAY_BASE/"$HOST"/"$PROM_HOST"}"
	echo "Kibana:      ${DISPLAY_BASE/"$HOST"/"$KIBANA_HOST"}"
	echo "Jaeger:      ${DISPLAY_BASE/"$HOST"/"$JAEGER_HOST"}"
	echo "MinIO UI:    ${DISPLAY_BASE/"$HOST"/"$MINIO_HOST"}"
	echo "MailHog UI:  ${DISPLAY_BASE/"$HOST"/"$MAILHOG_HOST"}"
	echo "pgAdmin:     ${DISPLAY_BASE/"$HOST"/"$PGADMIN_HOST"}"
	echo "Redis Cmdr:  ${DISPLAY_BASE/"$HOST"/"$REDIS_CMDR_HOST"}"
	echo "Elasticsearch: ${DISPLAY_BASE/"$HOST"/"$ELASTIC_HOST"}"

printf "\nKubernetes quick checks:\n"
echo "kubectl get deploy -n smartrelief"
echo "kubectl get pods -n smartrelief"
echo "kubectl get svc -n smartrelief"
echo "kubectl get ingress -n smartrelief"
echo "kubectl get hpa -n smartrelief"
	printf "\nAPIs:\n"
	API_BASE="$DISPLAY_BASE/api"
	OPENAPI_URL="$DISPLAY_BASE/openapi"
	AI_BASE="$DISPLAY_BASE/ai"
	echo "Backend API: $API_BASE"
	echo "OpenAPI UI:  $OPENAPI_URL"
	echo "AI Service:  $AI_BASE"
echo "kubectl get svc -n monitoring"
