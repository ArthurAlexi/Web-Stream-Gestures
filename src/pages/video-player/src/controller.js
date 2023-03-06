export default class Controller{

    #view
    #service
    #worker
    #camera
    #blinkedCounter = 0

    constructor({view, service, worker,camera}) {
        this.#service = service
        this.#view = view
        this.#worker = this.#configureWorker(worker)
        this.#camera = camera

        this.#view.configureBtnClick(this.onBtnStart.bind(this))

    }

    static async initialize(deps) {
        const controller = new Controller(deps)
        controller.log('not yet detecting eye blink! click in the button to start')

        return controller.init()
    }

    #configureWorker(worker){
        let ready = false

        worker.onmessage = ({ data })=>{
            if('READY' === data ){
                console.log('Worker is ready')
              this.#view.enableButton()
              ready = true
              return;  
            }

            const blinked = data.blinked
            this.#blinkedCounter += blinked
            this.#view.togglePlayVideo()
            console.log('blinked',blinked)
        }

        return {
            send (msg) {
                if(!ready) return;
                worker.postMessage(msg)
            }
        }
    }

    async init() {

    }

    loop(){
        const video = this.#camera.video
        const img = this.#view.getVideoFrame(video)
        this.#worker.send(img)

        this.log(`detecting eye blink...`)

        setTimeout(()=>this.loop(),100);
    }

    log(text) {
        const times = `      - blinked times: ${this.#blinkedCounter}`
        this.#view.log(`status: ${text}`.concat(this.#blinkedCounter ? times : ""))
    }

    onBtnStart(){
        this.log('initializing detection... ')
        this.#blinkedCounter = 0
        this.loop()
    }
}