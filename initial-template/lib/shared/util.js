function supportsWorkerType(){
    let suports = false
    const tester = {
        get type() { suports  = true}
    }


    try {
        new Worker('blob://',tester).terminate()
    } finally {
        return suports
    }
}


function prepareRunChecker({ timerDelay }) {
    let lastEvent = Date.now()
    return {
      shouldRun() {
        const result = (Date.now() - lastEvent) > timerDelay
        if(result) lastEvent = Date.now()
  
        return result
      }
    }
  }
  
  export {
    supportsWorkerType,
    prepareRunChecker
  }