
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function generateDirectLink(shareUrl) {
  try {
    const parsed = new URL(shareUrl)
    const surl = parsed.pathname.split("/s/")[1] || parsed.searchParams.get("surl")
    if (!surl) return null

    return {
      preview_url: `https://www.terabox.com/sharing/link?surl=${surl}`,
      stream_url: `https://www.terabox.com/streaming/link?surl=${surl}`,
      download_page: `https://www.terabox.com/share/init?surl=${surl}`
    }
  } catch (e) {
    return null
  }
}

async function handleRequest(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return new Response(JSON.stringify({ status: false, message: "Missing 'url' parameter" }), {
      headers: { "Content-Type": "application/json" },
      status: 400
    })
  }

  const links = generateDirectLink(url)

  if (!links) {
    return new Response(JSON.stringify({ status: false, message: "Invalid Terabox URL" }), {
      headers: { "Content-Type": "application/json" },
      status: 400
    })
  }

  return new Response(JSON.stringify({
    status: true,
    message: "Basic metadata extracted",
    preview_url: links.preview_url,
    watch_url: links.stream_url,
    download_page: links.download_page,
    file_info: {
      name: "Unknown (use advanced API for real metadata)",
      size: "Unknown",
      type: "Unknown"
    }
  }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  })
}
