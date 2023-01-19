function loadUnity(b_name, b_path, streamingAssetsUrl) {
  const b = `${b_path}/${b_name}`

  const hideFullScreenButton = 'true'
  const loaderUrl = b + '.loader.js'
  const config = {
    dataUrl: b + '.data.gz',
    frameworkUrl: b + '.framework.js.gz',
    codeUrl: b + '.wasm.gz',
    streamingAssetsUrl,
  }

  const container = document.querySelector('#unity-container')
  const canvas = document.querySelector('#unity-canvas')
  const loadingCover = document.querySelector('#loading-cover')
  const progressBarEmpty = document.querySelector('#unity-progress-bar-empty')
  const progressBarFull = document.querySelector('#unity-progress-bar-full')
  const fullscreenButton = document.querySelector('#unity-fullscreen-button')
  const spinner = document.querySelector('.spinner')

  const canFullscreen = (function() {
    for (const key of[
        'exitFullscreen',
        'webkitExitFullscreen',
        'webkitCancelFullScreen',
        'mozCancelFullScreen',
        'msExitFullscreen',
      ]) {
      if (key in document) {
        return true
      }
    }
    return false
  }())

  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    container.className = 'unity-mobile'
    config.devicePixelRatio = 1
  }
  loadingCover.style.display = ''

  const script = document.createElement('script')
  script.src = loaderUrl
  script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
      spinner.style.display = 'none'
      progressBarEmpty.style.display = ''
      progressBarFull.style.width = `${100 * progress}%`
    }).then((unityInstance) => {
      loadingCover.style.display = 'none'
      if (canFullscreen) {
        if (!hideFullScreenButton) {
          fullscreenButton.style.display = ''
        }
        fullscreenButton.onclick = () => {
          unityInstance.SetFullscreen(1)
        }
      }
    }).catch((message) => {
      alert(message)
    })
  }
  document.body.appendChild(script)
}