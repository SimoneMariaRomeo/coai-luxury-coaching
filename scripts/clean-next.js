const fs = require('fs/promises')
const path = require('path')

async function removeNextDir() {
  const target = path.join(__dirname, '..', '.next')

  try {
    await fs.rm(target, { recursive: true, force: true })
  } catch (error) {
    console.warn(`[clean-next] Unable to remove ${target}:`, error.message)
  }
}

removeNextDir().catch((error) => {
  console.error('[clean-next] Unexpected error:', error)
  process.exit(1)
})
