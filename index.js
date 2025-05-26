
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return new Response(JSON.stringify({ status: false, message: "Missing 'url' parameter" }), {
      headers: { "Content-Type": "application/json" },
      status: 400
    })
  }

  try {
    const apiResponse = await fetch("https://terabox.hello-kaiiddo.workers.dev/download?url=" + encodeURIComponent(url))
    const data = await apiResponse.json()

    if (!data || !data.status) {
      return new Response(JSON.stringify({ status: false, message: "Failed to fetch data from upstream API" }), {
        headers: { "Content-Type": "application/json" },
        status: 502
      })
    }

    const jsonResponse = {
      file_name: data.file_name || "unknown",
      file_size: data.size || "unknown",
      file_type: "video/mp4",
      thumbnail: data.thumbnail || "",
      subtitle: "Sample subtitle",
      preview_url: "https://www.terabox.com/sharing/link?surl=" + encodeURIComponent(url),
      download_url: data.download_url || ""
    }

    return new Response(JSON.stringify(jsonResponse), {
      headers: { "Content-Type": "application/json" }
    })

  } catch (error) {
    return new Response(JSON.stringify({ status: false, message: "Internal error", error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    })
  }
}
