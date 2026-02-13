# mcpserver.py
from fastmcp import FastMCP
from server import app  # Import your FastAPI app

# Convert FastAPI app to MCP server
mcp = FastMCP.from_fastapi(
    app=app,
    name="SITERANK AI Server",
)

if __name__ == "__main__":
    mcp.run()
