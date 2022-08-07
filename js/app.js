

class Productos{
    constructor (id,nombre,precio,stock){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.vendido = false;
        this.stock = stock
    }
    
    sumaIva(){
        this.precio = this.precio * 1.21;
    }

    /* Se comenta el codigo hasta poder implementarlo */

//      productoElegidos(cantArticulo,productos,listaProductosMostrar){

//         let compra = [];
//         for (let i = 0; i < cantArticulo; i++) {
    
//             let productoId = parseInt(prompt(listaProductosMostrar + "\n" + productos.map(p => `${p.id}:  ${p.nombre}  ${p.precio} \n`)));
//             compra[i] = productos.find(p => p.id === productoId);
//             productos[productoId - 1].vendido = true;
//             if(productos[productoId - 1].stock === 0) return alert("el producto elegido no tiene mas stock")
//             else productos[productoId - 1].stock -= 1;
//         }
//         return compra;
//     }

// }

// class ListaCompra{
//     constructor(id,lista,metodopago,descuento){
//         this.id = id;
//         this.lista = lista;
//         this.metodopago = metodopago;
//         this.descuento = descuento;
//     }
// }
}



const productos =[];
const listacompras = [];
let carrito = [];
let acumCarr= 0;

productos.push(new Productos(1,"Microprocesador",50000,10));
productos.push(new Productos(2,"RAM",6000,5));
productos.push(new Productos(3,"Disco Duro",5000,6));
productos.push(new Productos(4,"Placa de Video",80000,3));
productos.push(new Productos(5,"Fuente", 17000,4));
productos.push(new Productos(6,"RAM",6000,5));
productos.push(new Productos(7,"RAM",6000,5));
productos.push(new Productos(7,"RAM",6000,5));




// const json = JSON.stringify(productos);

// localStorage.setItem('miProducto',json);

// console.log(json);

let contenedorMain = document.getElementById("productos");
let padre = document.getElementById("button");
let button = document.createElement("div");
let cantProd = document.querySelector(".cantProd")
let Divcarrito = document.querySelector(".CardCarrito");


console.log(contenedorMain)
for(const producto of productos) producto.sumaIva();

/* agregar productos al carrito */
productos.forEach(producto => {
    const section = document.createElement('section');
    section.innerHTML += `
    <h3>${producto.nombre}</h3>
    <img src="imgs/mother.webp" alt="" width="250px" height="180px">
    <div class="addProducto"> 
        <h4>$ ${producto.precio}</h4>
        <button id=agregar${producto.id} class="iconAdd"><i class="fas fa-plus-circle"></i></button>
    </div>`;

 contenedorMain.appendChild(section);
    const boton = document.getElementById(`agregar${producto.id}`);

        boton.addEventListener('click',()=>{
        agregarCarrito(producto.id);
    }); 
})



let carritoHTML = document.getElementById("carrito");

const eliminarCarrito= (productoId)=>{
    const item = carrito.find(c => c.id === productoId);
    let indice = carrito.indexOf(item)
    carrito.splice(indice,1)
    acumCarr -=1;
    cantProd.innerHTML = `${acumCarr}`
    if(acumCarr == 0){
        cantProd.innerHTML = ""
    }
    actualizaCarrito();
}

const agregarCarrito = (productoId) =>{
    const item = productos.find(p => p.id === productoId)
    carrito.push(item);
    acumCarr += 1;
    cantProd.innerHTML = `${acumCarr}`
    actualizaCarrito();
}


const actualizaCarrito = () =>{
    carritoHTML.innerHTML = "";
    carrito.forEach(prod => {
        carritoHTML.innerHTML+=`
    <section>
    <h3>${prod.nombre}</h3>
    <img src="imgs/mother.webp" alt="" width="250px" height="180px">
    <div class="addProducto"> 
    <h4>$ ${prod.precio}</h4>
    <button onclick="eliminarCarrito(${prod.id})" class="iconAdd"><i class="fas fa-trash"></i></button>
    </div>
    <hr/>
    </section>`;
    })
}


let btnIconEcomercce = document.getElementById("btnIconEcomercce");
console.log(btnIconEcomercce);

/*Mostrar/Ocultar Div Carrito*/
btnIconEcomercce.addEventListener('click',()=>{

    ocultarCarrito();
})

const ocultarCarrito = () =>{
    if(Divcarrito.classList[1] == "inv"){
        Divcarrito.classList = "CardCarrito vis animate__animated animate__fadeInRight";
    }else{
        Divcarrito.classList = "CardCarrito  inv animate__animated animate__fadeInLeft  "; 
    }
}

/*Filtrar productos */

let formFiltro = document.getElementById("formFiltros");
console.log(formFiltro)

formFiltro.addEventListener("submit",e=>{
    filtrarProductos(e)
})

const filtrarProductos = e=>{
    e.preventDefault();
    // let mother = document.getElementById("mother").checked;
    Divcarrito.classList = "inv";
    
    let categoriaFiltrar
    if(document.getElementById("mother").checked){
        categoriaFiltrar = document.getElementById("mother").value;
    }
    
    if(document.getElementById("cpu").checked){
        
        categoriaFiltrar = document.getElementById("cpu").value;
    } 

    if(document.getElementById("ram").checked){
        
        categoriaFiltrar = document.getElementById("ram").value;
    } 

    if(document.getElementById("grafica").checked){
        
        categoriaFiltrar = document.getElementById("grafica").value;
    } 

    let prodFiltrado = productos.filter(p => p.nombre.toLowerCase() == categoriaFiltrar.toLowerCase());

    // prodFiltrado.push(item)

    console.log("producto",prodFiltrado);
    contenedorMain.innerHTML = "";
    prodFiltrado.forEach(producto => {
        const section = document.createElement('section');
        section.innerHTML += `
        <h3>${producto.nombre}</h3>
        <img src="imgs/mother.webp" alt="" width="250px" height="180px">
        <div class="addProducto"> 
            <h4>${producto.precio}</h4>
            <button id=agregar${producto.id} class="iconAdd"><i class="fas fa-plus-circle"></i></button>
        </div>`;
    
        contenedorMain.appendChild(section);
        const boton = document.getElementById(`agregar${producto.id}`);
    
            boton.addEventListener('click',()=>{
            agregarCarrito(producto.id);
        });
    })

}