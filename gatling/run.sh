#!/usr/bin/env bash

RESULTS_WORKSPACE="$(pwd)/gatling/user-files/results"
GATLING_WORKSPACE="$(pwd)/gatling/user-files"

runGatling() {
    sh "$GATLING_HOME"/bin/gatling.sh -rm local -s RinhaBackendSimulation \
        -rd "Rinha de Backend - 2024/Q1: Crébito" \
        -rf "$RESULTS_WORKSPACE" \
        -sf "$GATLING_WORKSPACE/simulations"
}

startTest() {
    for i in {1..20}; do
        # 2 requests to wake the 2 api instances up :)
        curl --fail http://localhost:9999/clientes/1/extrato && \
        echo "" && \
        curl --fail http://localhost:9999/clientes/1/extrato && \
        echo "" && \
        runGatling && \
        break || sleep 2;
    done
}

startTest
