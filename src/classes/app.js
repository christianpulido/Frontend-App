import { Article } from "./article";
import { ArticlePortal } from "./articlePortal";
import { ValidateEmail } from "../helpers/helpers";


class App {
    initialArticles = []
    allArticles = []
    allModels = []
    favoriteBtnStatus = false
    reservedBtnStatus = false

    main = document.querySelector('main')
    body = document.querySelector('body')

    filterBar = document.createElement('div')
    filterArea = document.querySelector('.filter_area')
    articlesList = document.querySelector('.articles_list')
    newArticleBtn = document.querySelector('.new_article')

    username = document.querySelector('.username')
    password = document.querySelector('.password')
    portalBtn = document.querySelector('.portal-btn')

    navbarTogglerBtn = document.querySelector('.navbar-toggler')
    navbarCollapse = document.querySelector('.navbar-collapse')
    startBtn = document.querySelector('.start_btn')
    accessBtn = document.querySelector('.access_btn')
    

    constructor() {
        this.getAllArticles()

        this.portalBtn.addEventListener('click', () => this.portalAccess())
        this.startBtn.addEventListener('click', () => this.backToStart())
    }

    createFilterMarkup(areaP = false){
        this.filterBar.className ='filter_bar row justify-content-end g-1'
        this.filterBar.innerHTML = `
      <div class="col-6 col-lg p-1">
        <select class="form-select brands_list" aria-label="Default select example">
          <option selected class="h6">Marca</option>
        </select>
      </div>
      <div class="col-6 col-lg p-1">
        <select class="form-select models_list" aria-label="Default select example">
          <option selected class="h6">Modelo</option>
          <option disabled>Selecciona una Marca</option>
        </select>
      </div>
      <div class="col-1 p-1">
        <p class="${areaP? "reserved_btn" : "favorite_btn"} bg-white border rounded w-100 h-100 p-0 m-0 d-flex justify-content-center align-items-center text-dark">
          <i class="${areaP? "reserved_filter bi bi-r-square" : "favorite_filter bi bi-star-fill"} fs-5 p-0"></i>
        </p>
      </div>
      <div class="col-3 col-lg-2 p-1">
        <button type="button" class="undo_btn btn btn-outline-secondary w-100 h-100 p-0">Deshacer</button>
      </div>
      <div class="col-3 col-lg-2 p-1">
        <button type="button" class="filter_btn btn btn-outline-primary w-100 h-100 p-0">Filtrar</button>
      </div>
        `
        this.filterArea.innerHTML = ''
        this.filterArea.append(this.filterBar)

        this.brandsList = document.querySelector('.brands_list')
        this.modelsList = document.querySelector('.models_list')
        this.filterBtn = document.querySelector('.filter_btn')
        this.undoBtn = document.querySelector('.undo_btn')

        this.favoriteBtn = document.querySelector('.favorite_btn')
        this.reservedBtn = document.querySelector('.reserved_btn')

        this.brandsList.addEventListener('click', () => this.modelsOptionsFilter())
        this.filterBtn.addEventListener('click', () => this.filterButton(areaP))
        this.undoBtn.addEventListener('click', () => this.undoButton(areaP))

        if(areaP){
            this.reservedBtn.addEventListener('click', () => this.changeReservedBtnStatus())

        } else {
            this.favoriteBtn.addEventListener('click', () => this.changeFavoriteBtnStatus())

        }

    }

    getAllArticles() {
        fetch('./src/assets/stock.json')
            .then((response) => response.json())
            .then((articles) => {
                articles.forEach((article) => {
                    this.initialArticles.push(article);
                })

            this.checkArea()

        })
        .catch(err => console.error(err))
    }
    checkArea(array = this.initialArticles, areaP = false) {
        if(areaP){
            this.allArticles = array
            .map((article) => {
                const newArticle = new ArticlePortal(article)

                newArticle.reservedBtn.addEventListener('click', () => this.changeReserved(newArticle))
                newArticle.editBtn.addEventListener('click', () => this.editArticle(newArticle))
                newArticle.deleteBtn.addEventListener('click', () => this.deleteArticle(newArticle))

                return newArticle
            })

            this.newArticleBtn.classList.remove('d-none')
            this.newArticleBtn.firstElementChild.addEventListener('click', () => this.createArticle())

        } else {
            this.allArticles = array
            .map((article) => {
                const newArticle = new Article(article)

                newArticle.favoriteIcon.addEventListener('click', () => this.changeFavorite(newArticle))
                newArticle.moreInfo.addEventListener('click', () => this.createInfoModal(newArticle))

                return newArticle
            })
            
            this.newArticleBtn.classList.add('d-none')
        }
        
        this.createFilterMarkup(areaP)
        this.printArticles()
        this.brandsOptionsFilter()


    }
    printArticles(array = this.allArticles) {
        this.articlesList.innerHTML = ''
        array.forEach((article) => {
            this.articlesList.append(article.articleHTML)
        })
    }


    brandsOptionsFilter() {
        this.brandsList.innerHTML = ''
        
        const option = document.createElement('option')
        option.className = 'brand_option'
        option.setAttribute('value', 'Marca')
        option.innerHTML = 'Marca'

        this.brandsList.append(option)
        let allBrands = []

        this.allArticles.forEach((article) => {
            allBrands.push(article.brand)
        })

        allBrands = [...new Set(allBrands)]
        allBrands = allBrands.sort()

        allBrands.forEach((brand) => {
            const option = document.createElement('option')
            option.className = 'brand_option'
            option.setAttribute('value', brand)
            option.innerHTML = brand

            this.brandsList.append(option)
        })
    }
    modelsOptionsFilter() {
        let allModels = []

        this.allArticles.forEach((article) => {
            if (article.brand === this.brandsList.value) {
                allModels.push(article.model)
            }
        })

        allModels = [...new Set(allModels)]
        allModels = allModels.sort()

        if (allModels.length === 0) {
            this.modelsList.innerHTML=`
            <option selected class="h6">Modelo</option>
            <option disabled>Selecciona una Marca</option>
            `
        } else { 
            this.modelsList.innerHTML=`
            <option selected class="h6">Modelo</option>
            `
        }

        allModels.forEach((model) => {
            const option = document.createElement('option')
            option.className = 'model_option'
            option.setAttribute('value', model)
            option.innerHTML = model

            this.modelsList.append(option)
        })
    }
    changeFavoriteBtnStatus() {
        if(!this.favoriteBtnStatus) {
            this.favoriteBtn.classList.add('bg-secondary')
            this.favoriteBtn.classList.remove('bg-white')
            this.favoriteBtnStatus = !this.favoriteBtnStatus

        } else if(this.favoriteBtnStatus) {
            this.favoriteBtn.classList.remove('bg-secondary')
            this.favoriteBtn.classList.add('bg-white')
            this.favoriteBtnStatus = !this.favoriteBtnStatus
        }
    }
    changeReservedBtnStatus() {
        if(!this.reservedBtnStatus){
            this.reservedBtn.classList.add('bg-secondary')
            this.reservedBtn.classList.remove('bg-white')
            this.reservedBtnStatus = !this.reservedBtnStatus

        } else {
            this.reservedBtn.classList.add('bg-white')
            this.reservedBtn.classList.remove('bg-secondary')
            this.reservedBtnStatus = !this.reservedBtnStatus

        }

    }
    createFilterAlert(alertMessage) {

        if(this.filterBar.lastElementChild.role === 'alert') {
            this.filterBar.lastElementChild.remove()
        }

        const alert = document.createElement('div')
        alert.className = 'alert alert-danger col-12 p-1 m-0 mt-1 text-center'
        alert.setAttribute('role', 'alert')
        alert.innerHTML= `${alertMessage}`

        this.filterBar.append(alert)
    }
    filterButton(areaP) {

        let firstCondition = this.brandsList.value
        let secondCondition

        if(areaP) {
            secondCondition = this.reservedBtnStatus
        } else {
            secondCondition = this.favoriteBtnStatus
        }

        if(firstCondition === 'Marca' && !secondCondition) {
            this.createFilterAlert('Debes seleccionar al menos 1 filtro.')

        } else {
            if(this.filterBar.lastElementChild.role === 'alert') {
                this.filterBar.lastElementChild.remove()
            }

            let filterList = [... this.allArticles]
            let filterList1 = []
            let filterList2 = []
            let filterList3 = []
            let filterList4 = []
            
            if(this.brandsList.value != 'Marca') {
                filterList1 = filterList.filter((article) => {
                    return article.brand === this.brandsList.value ? true : false
                })
            } else {
                filterList1 = filterList
            }
    
            if(this.modelsList.value != 'Modelo') {
                filterList2 = filterList1.filter((article) => {
                    return article.model === this.modelsList.value ? true : false
                })
            } else {
                filterList2 = filterList1
            }
            
            if(this.favoriteBtnStatus) {
                filterList3 = filterList2.filter((article) => {
                    return article.favorite? true : false
                })
            } else {
                filterList3 = filterList2
            }

            if(this.reservedBtnStatus) {
                filterList4 = filterList3.filter((article) => {
                    return article.reserved? true : false
                })
            } else {
                filterList4 = filterList3
            }

            this.printArticles(filterList4)

            if(filterList4.length === 0) {
                this.createFilterAlert('No se ha encontrado ninguna oferta.')
            }

        }
    }
    undoButton() {
        if(this.filterBar.lastElementChild.role === 'alert') {
            this.filterBar.lastElementChild.remove()
        }

        this.brandsList.value = 'Marca'
        
        this.modelsList.innerHTML=`
        <option selected class="h6">Modelo</option>
        <option disabled>Selecciona una Marca</option>
        `

        if(this.reservedBtnStatus) {
            this.reservedBtn.classList.remove('bg-secondary')
            this.reservedBtn.classList.add('bg-white')
            this.reservedBtnStatus = !this.reservedBtnStatus
        }


        if(this.favoriteBtnStatus) {
            this.favoriteBtn.classList.remove('bg-secondary')
            this.favoriteBtn.classList.add('bg-white')
            this.favoriteBtnStatus = !this.favoriteBtnStatus
        }
        
        

        this.printArticles()
    }


    collapseNavbar() {
        this.navbarTogglerBtn.classList.add('collapsed')
        this.navbarCollapse.classList.remove('show')
    }
    backToStart() {
        this.undoButton()
        this.collapseNavbar()
    }


    changeFavorite(articleClick) {

        if(articleClick.favorite){
          articleClick.favoriteIcon.classList.remove('bi-star-fill')
          articleClick.favoriteIcon.classList.add('bi-star')
          articleClick.favorite = !articleClick.favorite
  
  
        } else {
          articleClick.favoriteIcon.classList.remove('bi-star')
          articleClick.favoriteIcon.classList.add('bi-star-fill')
          articleClick.favorite = !articleClick.favorite
  
        }
        
    }

      
    closeModal(modal) {
        modal.remove()
        this.body.classList.remove('overflow-hidden')
    }
    validateInfoModal(email) {
        if(ValidateEmail(email)) {
            if(email.nextElementSibling.role === 'alert') {
                email.nextElementSibling.remove()
            }
            email.classList.remove('is-invalid')
            email.classList.add('is-valid')

            const emailSuccess = document.createElement('div')
            emailSuccess.setAttribute('role', 'alert')
            emailSuccess.className = 'alert alert-success mt-2 text-center'
            emailSuccess.innerHTML = 'Nuestro equipo se pondrá en contacto lo antes posible.'

            email.after(emailSuccess)

        } else {
            email.classList.remove('is-valid')
            email.classList.add('is-invalid')

            if(email.nextElementSibling.role === 'alert') {
                email.nextElementSibling.remove()
            }

        }

    }
    createInfoModal(articleClick) {
        this.body.classList.add('overflow-hidden')
        
        const infoModal = document.createElement('div')
        infoModal.className = "myModal position-fixed min-vw-100 min-vh-100 top-0 m-0 p-0"

        if(articleClick.reserved){
            infoModal.innerHTML = `
        <div class="min-vw-100 min-vh-100">
          <div class="position-absolute w-50 h-50 top-50 start-50 translate-middle">
            <div class="border rounded bg-white p-3 shadow">
              <div class="d-flex align-items-center">
                <p class="h5 w-100 m-0 mx-4 p-1 border rounded bg-secondary text-center text-white">${articleClick.brand} - ${articleClick.model} ${articleClick.year}</p>
                <button type="button" class="close-modal btn-close ms-auto" aria-label="Close"></button>
              </div>
          
              <div class="alert alert-danger text-center mt-2" role="alert">
                Este vehículo ya ha sido reservado.
              </div>
            </div>
          </div>
        </div>
        `
        
        this.main.prepend(infoModal)

        } else {
            infoModal.innerHTML = `
        <div class="min-vw-100 min-vh-100">
          <div class="position-absolute w-50 h-50 top-50 start-50 translate-middle">
            <div class="border rounded bg-white p-3 shadow">
              <div class="d-flex align-items-center">
                <p class="h5 w-100 m-0 mx-4 p-1 border rounded bg-secondary text-center text-white">${articleClick.brand} - ${articleClick.model} ${articleClick.year}</p>
                <button type="button" class="close-modal btn-close ms-auto" aria-label="Close"></button>
              </div>
          
              <div class="form-floating my-3">
                <input type="email" class="customer-email form-control" id="floatingInput" placeholder="name@example.com">
                <label for="floatingInput">Email address</label>
              </div>
              <div class="d-flex mt-3">
                <button type="button" class="send-info btn btn-primary ms-auto w-50">Enviar</button>
              </div>
            </div>
          </div>
        </div>
        `

        this.main.prepend(infoModal)

        const customerEmail = document.querySelector('.customer-email')

        document.querySelector('.send-info').addEventListener('click', () => this.validateInfoModal(customerEmail))

        }
        
        document.querySelector('.close-modal').addEventListener('click', () => this.closeModal(infoModal))

    }


    portalAccess() {
        this.collapseNavbar()
        this.body.classList.add('overflow-hidden')
        
        const accessResult = document.createElement('div')
        accessResult.classList.add('access-result', 'alert', 'm-0', 'p-2', 'text-center', 'position-absolute', 'w-100')
        accessResult.setAttribute('role', 'alert')

        if(this.username.value === "username" && this.password.value === "password") {

            accessResult.classList.add('alert-success')
            accessResult.innerHTML = 'Has ingresado correctamente.'
            this.main.prepend(accessResult)

            const outBtn = document.createElement('li')
            outBtn.classList.add('nav-item', 'mx-lg-3')
            outBtn.innerHTML = `
            <a class="nav-link" aria-current="page" href="#">Salir</a>
            `
            this.navbarCollapse.firstElementChild.lastElementChild.remove()
            this.navbarCollapse.firstElementChild.append(outBtn)

            outBtn.addEventListener('click', () => this.portalExit())

            this.checkArea(this.allArticles, true)

        } else {
            accessResult.classList.add('alert-danger')
            accessResult.innerHTML = 'Datos incorrectos.'
            this.main.prepend(accessResult)
        }

        accessResult.addEventListener('animationend', () => {
            accessResult.remove()
            this.body.classList.remove('overflow-hidden')

        })

    }
    portalExit(){
        this.collapseNavbar()

        const loginBtn = document.createElement('li')
        loginBtn.classList.add('nav-item', 'dropdown', 'mx-lg-3')
        loginBtn.innerHTML = `
        <a class="nav-link-portal nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Acceso Personal
        </a>
        <ul class="dropdown-menu p-0">
          <li>
            <div class="input m-2">
              <input type="text" class="username form-control w-100" placeholder="username" value="username">
            </div>
          </li>
          <li>
            <div class="input m-2">
              <input type="password" class="password form-control w-100" placeholder="password" value="password">
            </div>
          </li>
          <li>
            <div class="m-2">
              <button type="button" class="portal-btn btn btn-primary">Acceder</button>
            </div>

          </li>
        </ul>
        `

        this.navbarCollapse.firstElementChild.lastElementChild.remove()
        this.navbarCollapse.firstElementChild.append(loginBtn)

        this.portalBtn = document.querySelector('.portal-btn')
        this.portalBtn.addEventListener('click', () => this.portalAccess())

        this.checkArea(this.allArticles, false)

    }


    changeReserved(articleClick) {

        if(!articleClick.reserved){
            articleClick.reservedBtn.classList.remove('border-primary', 'text-primary')
            articleClick.reservedBtn.classList.add('border-danger', 'text-danger')
            articleClick.reservedBtn.innerHTML = 'RESERVADO'
            articleClick.reserved = !articleClick.reserved

  
        } else {
            articleClick.reservedBtn.classList.remove('border-danger', 'text-danger')
            articleClick.reservedBtn.classList.add('border-primary', 'text-primary')
            articleClick.reservedBtn.innerHTML = 'DISPONIBLE'
            articleClick.reserved = !articleClick.reserved
  
        }
    }
    deleteArticle(articleClick) {
        for (let i = 0; i < this.allArticles.length; i++){

            if(this.allArticles[i].ref === articleClick.ref) {
                this.allArticles.splice(i, 1)
            }
        }
        this.printArticles(this.allArticles, true)
        this.brandsOptionsFilter()

    }
    editArticle(articleClick) {
        this.body.classList.add('overflow-hidden')
        
        const editModal = document.createElement('div')
        editModal.className = "myModal position-fixed min-vw-100 min-vh-100 top-0 m-0 p-0"

        editModal.innerHTML = `
    <div class="min-vw-100 min-vh-100">
      <div class="position-absolute w-50 mt-5 h-50 start-50 translate-middle-x">
        <div class="border rounded bg-white p-3 shadow">      
          <div class="input-group mb-3">
            <span class="input-group-text">Marca</span>
            <input type="text" class="form-control new-brand" value="${articleClick.brand}">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Modelo</span>
            <input type="text" class="form-control new-model" value="${articleClick.model}">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Precio de venta</span>
            <input type="number" class="form-control new-sale-price" value="${articleClick.sale_price}">
            <span class="input-group-text">€</span>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Km</span>
            <input type="number" class="form-control new-km" value="${articleClick.km}">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Año</span>
            <input type="number" class="form-control new-year" value="${articleClick.year}">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Combustible</span>
            <input type="text" class="form-control new-gas" value="${articleClick.gas}">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Caja de cambios</span>
            <input type="text" class="form-control new-gearbox" value="${articleClick.gearbox}">
          </div>

          <div class="d-flex justify-content-end">
            <button type="button" class="cancel-edit-modal w-25 btn btn-danger">Cancelar</button>
            <button type="button" class="send-edit-modal w-25 btn ms-2 btn-primary">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
    `

    this.main.prepend(editModal)

    document.querySelector('.cancel-edit-modal').addEventListener('click', () => this.closeModal(editModal))
    document.querySelector('.send-edit-modal').addEventListener('click', () => this.updateArticle(articleClick))
    }
    updateArticle(articleClick) {
        const newBrand = document.querySelector('.new-brand').value
        const newModel = document.querySelector('.new-model').value
        const newSalePrice = document.querySelector('.new-sale-price').value
        const newKm = document.querySelector('.new-km').value
        const newYear = document.querySelector('.new-year').value
        const newGas = document.querySelector('.new-gas').value
        const newGearbox = document.querySelector('.new-gearbox').value
    
        let i = this.initialArticles.findIndex(article => article.ref === articleClick.ref)

        this.initialArticles[i].brand = newBrand
        this.initialArticles[i].model = newModel
        this.initialArticles[i].sale_price = newSalePrice
        this.initialArticles[i].km = newKm
        this.initialArticles[i].year = newYear
        this.initialArticles[i].gas = newGas
        this.initialArticles[i].gearbox = newGearbox

        this.closeModal(document.querySelector('.myModal'))
        this.checkArea(this.initialArticles, true)
    }
    createArticle() {
        this.body.classList.add('overflow-hidden')
        
        const createModal = document.createElement('div')
        createModal.className = "myModal position-fixed min-vw-100 min-vh-100 top-0 m-0 p-0"

        createModal.innerHTML = `
    <div class="min-vw-100 min-vh-100">
      <div class="position-absolute w-50 mt-5 h-75 p-2 start-50 translate-middle-x">
        <div class="border rounded bg-white p-3 h-100 shadow create_modal">
          <div class="input-group mb-3">
            <span class="input-group-text">Matricula</span>
            <input type="text" class="form-control new-ref">
          </div>     
          <div class="input-group mb-3">
            <span class="input-group-text">Marca</span>
            <input type="text" class="form-control new-brand">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Modelo</span>
            <input type="text" class="form-control new-model">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Precio de venta</span>
            <input type="number" class="form-control new-sale-price">
            <span class="input-group-text">€</span>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Km</span>
            <input type="number" class="form-control new-km">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Año</span>
            <input type="number" class="form-control new-year">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Combustible</span>
            <input type="text" class="form-control new-gas">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Caja de cambios</span>
            <input type="text" class="form-control new-gearbox">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Foto 1</span>
            <input type="text" class="form-control new-photo1">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Foto 2</span>
            <input type="text" class="form-control new-photo2">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Foto 3</span>
            <input type="text" class="form-control new-photo3">
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Foto 4</span>
            <input type="text" class="form-control new-photo4">
          </div>

          <div class="d-flex justify-content-end">
            <button type="button" class="cancel-create-modal w-25 btn btn-danger">Cancelar</button>
            <button type="button" class="send-create-modal w-25 btn ms-2 btn-primary">Crear</button>
          </div>
        </div>
      </div>
    </div>
    `

        this.main.prepend(createModal)

        document.querySelector('.cancel-create-modal').addEventListener('click', () => this.closeModal(createModal))
        document.querySelector('.send-create-modal').addEventListener('click', () => {
        
            const newRef = document.querySelector('.new-ref').value
            const newBrand = document.querySelector('.new-brand').value
            const newModel = document.querySelector('.new-model').value
            const newSalePrice = document.querySelector('.new-sale-price').value
            const newKm = document.querySelector('.new-km').value
            const newYear = document.querySelector('.new-year').value
            const newGas = document.querySelector('.new-gas').value
            const newGearbox = document.querySelector('.new-gearbox').value
            const photo1 = document.querySelector('.new-photo1').value
            const photo2 = document.querySelector('.new-photo2').value
            const photo3 = document.querySelector('.new-photo3').value
            const photo4 = document.querySelector('.new-photo4').value

            let newArticle = {
                ref: newRef,
                brand: newBrand,
                model: newModel,
                year: newYear,
                km: newKm,
                sale_price: newSalePrice,
                gearbox: newGearbox,
                gas: newGas,
                photos: [
                    photo1,
                    photo2,
                    photo3,
                    photo4
                ],
                favorite: false,
                reserved: false
            }

            this.initialArticles.push(newArticle)
            this.closeModal(createModal)
            this.checkArea(this.initialArticles, true)
        })
    }
}


export { App }