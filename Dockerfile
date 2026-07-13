# PAPI MCP server — stdio transport.
#
# PAPI's engine is closed-source; the supported runtime is the public npm
# package @papi-ai/server. This image installs it and starts the MCP server on
# stdio, which is all a directory/health check needs: the server boots and
# answers introspection (initialize + tools/list -> 47 tools) with no project
# configured. Tool CALLS still require an account and fail closed with setup
# instructions, so this image is safe to run anonymously.
#
# Run:  docker run -i --rm papi

FROM node:20-alpine

RUN npm install -g @papi-ai/server@latest

# stdio MCP server: JSON-RPC on stdin/stdout, diagnostics on stderr.
ENTRYPOINT ["papi-server"]
