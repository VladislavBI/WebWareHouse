function onSuccess(result) {
    if (result.url) {
        // if the server returned a JSON object containing an url
        // property we redirect the browser to that url
        window.location.href = result.url;
    }
}