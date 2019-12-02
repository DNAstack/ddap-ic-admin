#!/usr/bin/env bash

set -e
set -x

COMMON_PROTO_FILE=../shared/protos/proto/common/v1/common.proto
SRC_IC_PROTO_FILE=../shared/protos/ic_service.proto
OUT_IC_FILE=ic-service
SRC_TOKEN_PROTO_FILE=../shared/protos/token_service.proto
OUT_TOKEN_FILE=token-service
TMP_DIR="./tmp"
TMP_PROTO_FILE=${TMP_DIR}/temporary.proto
OUT_DIR="./src/app/shared/proto"
PBJS_BIN="./node_modules/protobufjs/bin/pbjs"
PBTS_BIN="./node_modules/protobufjs/bin/pbts"

# Clean the output folder before generating protos
rm -rf ${OUT_DIR}

mkdir -p ${TMP_DIR}
mkdir -p ${OUT_DIR}

# IC
cp ${SRC_IC_PROTO_FILE} ${TMP_PROTO_FILE}

${PBJS_BIN} -t static-module -w commonjs -o ${OUT_DIR}/${OUT_IC_FILE}.js ${TMP_PROTO_FILE} ${COMMON_PROTO_FILE}
${PBTS_BIN} -o ${OUT_DIR}/${OUT_IC_FILE}.d.ts ${OUT_DIR}/${OUT_IC_FILE}.js

# TOKEN
cp ${SRC_TOKEN_PROTO_FILE} ${TMP_PROTO_FILE}

${PBJS_BIN} -t static-module -w commonjs -o ${OUT_DIR}/${OUT_TOKEN_FILE}.js ${TMP_PROTO_FILE} ${COMMON_PROTO_FILE}
${PBTS_BIN} -o ${OUT_DIR}/${OUT_TOKEN_FILE}.d.ts ${OUT_DIR}/${OUT_TOKEN_FILE}.js
