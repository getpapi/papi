# PAPI for DeepSeek Harness

Connect [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) to [PAPI](https://getpapi.ai) through the Harness-owned Streamable HTTP MCP client.

This is a declarative bundle. It contains no executable PAPI code and no credentials.

## Install

Create a PAPI connection token, expose it only to the process launching DeepSeek Harness, and install the bundle into the profile you use:

```powershell
$env:PAPI_CONNECTION_TOKEN = '<your-token>'
dsh plugin --profile web add @papi-ai/deepseek-harness
```

For Bash-compatible shells:

```bash
export PAPI_CONNECTION_TOKEN='<your-token>'
dsh plugin --profile web add @papi-ai/deepseek-harness
```

Verify the configuration before booting:

```text
dsh --profile web --dump-config
```

The model receives PAPI tools under the `mcp__papi__*` namespace.

## Security

Never commit the connection token or place it directly in `cordis.patch.yml`. DeepSeek Harness applies bundle configuration during profile boot; inspect the package contents before installation. This bundle mounts only the official `@deepseek-ai/dsh-mcp-client` and points it at `https://mcp.getpapi.ai/mcp`.

## Compatibility

Verified against DeepSeek Harness `0.1.0-rc.6`. DeepSeek Harness is currently a developer preview and may introduce breaking changes.

## Remove

```text
dsh plugin --profile web remove @papi-ai/deepseek-harness
```
