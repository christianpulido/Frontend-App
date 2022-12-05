class Article {
    constructor(newArticle) {
      this.ref = newArticle.ref
      this.brand = newArticle.brand
      this.model = newArticle.model
      this.year = newArticle.year
      this.km = newArticle.km
      this.sale_price = newArticle.sale_price
      this.gearbox = newArticle.gearbox
      this.gas = newArticle.gas
      this.photos = newArticle.photos
      this.favorite = newArticle.favorite
      this.reserved = newArticle.reserved

      this.articleHTML = document.createElement('div')
      this.moreInfo = document.createElement('p')
      this.favoriteIcon = document.createElement('i')
      this.reservedMark = document.createElement('p')

      this.createMoreInfoMarkup()
      this.createFavoriteIconMarkup()
      this.createMarkup()
    }

    createReservedMark() {
      this.reservedMark.className = 'border border-2 border-danger rounded text-danger h2 p-1 m-0 mb-4 position-absolute bottom-50 start-50 translate-middle'
      this.reservedMark.innerHTML = 'RESERVADO'
    }

    createMoreInfoMarkup() {
      this.moreInfo.className = 'more_info m-0 small'
      this.moreInfo.innerHTML = 'Solicitar mas información ➝'
    }

    createFavoriteIconMarkup() {
      this.favoriteIcon.className = `articles_btns bi ${this.favorite? "bi-star-fill": "bi-star"} fs-5 text-primary px-2 py-1`
    }

    createMarkup() {
        this.articleHTML.className = `col-12 col-md-6 col-lg-6 col-xl-4 p-2 position-relative`
        this.articleHTML.innerHTML = `
    <article class="shadow rounded border p-2">
        <div id="id${this.ref}" class="carousel slide">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#id${this.ref}" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#id${this.ref}" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#id${this.ref}" data-bs-slide-to="2" aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#id${this.ref}" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active ratio ratio-16x9">
                <img class="article_image" src="${this.photos[0]}" class="d-block w-100" alt="Foto ${this.model} ${this.year}">
              </div>
              <div class="carousel-item ratio ratio-16x9">
                <img class="article_image" src="${this.photos[1]}" class="d-block w-100" alt="Foto ${this.model} ${this.year}">
              </div>
              <div class="carousel-item ratio ratio-16x9">
                <img class="article_image" src="${this.photos[2]}" class="d-block w-100" alt="Foto ${this.model} ${this.year}">
              </div>
              <div class="carousel-item ratio ratio-16x9">
                <img class="article_image" src="${this.photos[3]}" class="d-block w-100" alt="Foto ${this.model} ${this.year}">
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#id${this.ref}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#id${this.ref}" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
        </div>
        <div class="d-flex align-items-center m-2">
            <h2 class="fs-5 fw-normal m-0 me-2">${this.brand}</h2>
            <h3 class="fs-5 m-0 me-auto">${this.model}</h3>
            <h4 class="fs-5 m-0"><span>${this.sale_price}</span> €</h4>
        </div>
        <div class="d-flex align-items-center justify-content-around m-2">
            <p class="fs-6 m-0 border rounded px-1 py-0">${this.km} km</p>
            <p class="fs-6 m-0 border rounded px-1 py-0">${this.year}</p>
            <p class="fs-6 m-0 border rounded px-1 py-0">${this.gas}</p>
            <p class="fs-6 m-0 border rounded px-1 py-0">${this.gearbox}</p>
        </div>
        <div class="client_area d-flex align-items-center justify-content-around m-2">

        </div>
    </article>
    `

        this.articleHTML.querySelector('.client_area').append(this.moreInfo, this.favoriteIcon)

        if(this.reserved) {
          this.createReservedMark()
          this.articleHTML.append(this.reservedMark)
        }
    }

  }

export { Article }