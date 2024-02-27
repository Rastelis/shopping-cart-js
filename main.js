const cart = [[], []];
const shoppingCart = document.querySelector(".shopping-cart");
const shoppingCartContainer = document.querySelector(".shopping-cart-container")
shoppingCartContainer.style.display = "none";
const calculateWidth = (rating, width, max) => {
    return rating * width / max;
}

const productList = data.products.map(value => {
    const discountPrice = calculateDiscountedPrice(value.price, value.discountPercentage);

    return `<div class="row">
                <div class="col-auto image-shop">
                    <img src="${value.thumbnail}">
                </div>
                <div class="col info">
                    <h3>${value.title}</h3>
                    <div class="rating">
                        <div class="gray-stars">
                            ${`<i class="bi bi-star-fill"></i>`.repeat(5)}
                        </div>
                        <div class="yellow-stars" style="width: ${calculateWidth(value.rating, 80, 5)}px">
                            <div class="stars-container">
                                ${`<i class="bi bi-star-fill"></i>`.repeat(5)}
                            </div>
                        </div>
                    </div>
                    <div class="description pt-5">${value.description}</div>
                </div>
                <div class="col-auto checkout">
                    <div class="price mb-3">
                        ${value.discountPercentage === 0 ? `
                            <span class="original-price">&dollar;${value.price}</span>
                        ` : `
                            <span class="discount-price">&dollar;${discountPrice}</span>
                            <span class="regular-price">&dollar;${value.price}</span>
                        `}
                    </div>
                    <a href="#" onclick="addToCart(event, ${value.id})" class="btn btn-warning">Add to Cart</a>
                </div>
            </div>`;
});

const shop = document.querySelector(".shop")
shop.innerHTML = productList.join('');

const headerPlaceholder = document.querySelector(".header-placeholder")
const header = document.querySelector("header")

const compStyles = window.getComputedStyle(header)

headerPlaceholder.style.height = compStyles.height
headerPlaceholder.style.width = "100%"

const shoppingCartButton = document.querySelector(".go-to-cart");
// const priceSum = document.querySelector(".sum")


shoppingCartButton.onclick = () => {

    if (shoppingCartButton.textContent === "Go to Cart") {
        shop.style.display = "none"
        shoppingCartContainer.style.display = "flex"
        shoppingCartButton.textContent = "Go back to Shop";
    }
    else {
        shoppingCartContainer.style.display = "none";
        shop.style.display = "block"
        shoppingCartButton.textContent = "Go to Cart";
    }
}
function updateCartList() {
    const cartList = cart[0].map((value, index) => {
        // const discountPrice = (value.price - (value.price / 100 * value.discountPercentage)).toFixed(2);
        const discountPrice = calculateDiscountedPrice(value.price, value.discountPercentage);
        return `<div class="col d-flex gap-2 my-4">
                    <div class="col-auto image-cart">
                        <img src="${value.thumbnail}">
                    </div>
                    <div class="col-3 d-flex align-items-center info">
                        <div>
                            <div class="brand">${value.brand}</div>
                            <div class="title">${value.title}</div>
                        </div>
                    </div>
                    <div class="col-3 quantity d-flex align-items-center">
                    <div class="input-group">
                    <button onclick="addOne(${value.id})" class="btn btn-secondary">-</button><input class="qty-input form-control" type="number" value="${cart[1][index]}"><button onclick="removeOne(${value.id})" class="btn btn-secondary">+</button>
                    </div>
                    </div>
                    <div class="col-2 d-flex align-items-center justify-content-center price">
                        <div>&dollar;${discountPrice}</div>
                    </div>
                    <div class="col-2 d-flex align-items-center remove">
                        <button class="btn btn-secondary">x</button>
                    </div>
                </div>`;
    });
    shoppingCart.innerHTML = cartList.join('');
}

function calculateDiscountedPrice(price, discount) {
    if (discount === 0) return price;
    return (price - (price / 100 * discount)).toFixed(2);
}

function itemCount() {
    return cart[1].reduce((sum, current) => sum + current)
}

function calculatePriceSum() {
    let result = cart[0].reduce((sum, value, index) => {
        return sum + calculateDiscountedPrice(value.price, value.discountPercentage) * cart[1][index]
    }, 0);
    result = result.toFixed(2);
    return result
}

function addToCart(e, id) {
    // stops scroling after button click. because of h ref="#"  
    e.preventDefault();

    const obj = data.products.find(element => element.id === id)

    if (cart[0].includes(obj)) {
        cart[1][cart[0].indexOf(obj)]++;
    }
    else {
        cart[0].push(obj);
        cart[1].push(1);
    }
    // sconsole.log(cart);
    updateCartList();
    document.querySelector(".item-qty").textContent = itemCount()
    document.querySelector(".sum").textContent = "$" + calculatePriceSum()
    document.querySelector(".total-price").textContent = "$" + ((parseFloat(calculatePriceSum()) + parseFloat(document.querySelector("select").value))).toFixed(2);
}

function updateTotalPrice() {
    document.querySelector(".total-price").textContent = "$" + (parseFloat(calculatePriceSum()) + parseFloat(document.querySelector("select").value)).toFixed(2);
    console.log(typeof (calculatePriceSum()))
}

//not working

function addOne(id) {

    const obj = cart[0].find(element => element.id === id)
    const index = cart.indexOf(obj)
    cart[1][index]++;

}

function removeOne(id) {
    const obj = cart[0].find(element => element.id === id)
    const index = cart.indexOf(obj)
    cart[1][index]--;
    if (cart[1][index] === 0) {
        cart[0].splice(index,1);
        cart[1].splice(index,1);
    } ;
}