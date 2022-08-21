

class Productos{
    constructor (id,nombre,precio,stock,img){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.vendido = false;
        this.stock = stock
        this.img = img
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
    const contenedorMain = document.getElementById("productos");
    const padre = document.getElementById("button");
    const button = document.createElement("div");
    const cantProd = document.querySelector(".cantProd")
    const Divcarrito = document.querySelector(".CardCarrito");
    const carritoHTML = document.getElementById("carrito");
    
    /* Consumir API Producto*/
    
    
const apiProductos = async() =>{
        
        const response = await fetch(`https://restserver-node-producto.herokuapp.com/api/productos`);

        const {producto} = await response.json();
        console.log(producto);

        producto.forEach(dp => {
            productos.push(new Productos(dp._id,dp.nombre.toString(),dp.precio,dp.stock,dp.img))
        });
}

const mostrarProductos = async() =>{
    await apiProductos();
    for(const producto of productos) producto.sumaIva();
    productos.forEach(({nombre,precio,id,img}) => {
        const section = document.createElement('section');
        section.innerHTML += `
        <h3>${nombre}</h3>
        <img src="${img}" alt="" width="250px" height="180px">
        <div class="addProducto"> 
            <h4>$ ${precio}</h4>
            <button id=agregar${id} class="iconAdd"><i class="fas fa-plus-circle"></i></button>
        </div>`;
    
     contenedorMain.appendChild(section);
        const boton = document.getElementById(`agregar${id}`);
    
            boton.addEventListener('click',()=>{
                Swal.fire({
                    position: 'bottom-end',
                    icon: 'success',
                    title: 'El árticulo fue agregado al carrito',
                    showConfirmButton: false,
                    timer: 1000,
                    width:400
                    
                  })
            agregarCarrito(id);
        }); 
    })
    
}

mostrarProductos();


const recuperarLocalStorage = () => {

    if(localStorage != null && localStorage.getItem("listaCompra") != "" ){

        let localCarrito = JSON.parse(localStorage.getItem("listaCompra"));
        for (let i = 0; i < localCarrito.length; i++) {
            const element = localCarrito[i].id;
            agregarCarrito(element);
        }
    }
}


const agregarCarrito = (productoId) =>{
    const item = productos.find(p => p.id === productoId)
    carrito.push(item);
    acumCarr++;
    cantProd.innerHTML = `${acumCarr}`

    actualizaCarrito();
}

const eliminarCarrito= (productoId)=>{
    const item = carrito.find(c => c.id === productoId);
    let indice = carrito.indexOf(item)
    carrito.splice(indice,1)
    acumCarr--;
    cantProd.innerHTML = `${acumCarr}`
    if(acumCarr == 0){
        cantProd.innerHTML = ""
    }

    Swal.fire(
        'El articulo fue eliminado!',
        '',
        'success'
      )
    actualizaCarrito();
}

const actualizaCarrito = () =>{
    carritoHTML.innerHTML = "";
    carrito.forEach(({nombre,precio,id,img}) => {
        console.log(id);
        carritoHTML.innerHTML+=`
        <section>
        <h3>${nombre}</h3>
        <img src="${img}" alt="" width="250px" height="180px">
        <div class="addProducto"> 
            <h4>$ ${precio}</h4>
            <button onclick="eliminarCarrito('${id}')" class="iconAdd"><i class="fas fa-trash"></i></button>
        </div>
        <hr/>
        </section>`;
    })
    
    localStorage.setItem("listaCompra", JSON.stringify(carrito));
    carritoHTML.innerHTML+=`<button id="btnFinalizarCompra">Finalizar Compra</button>`;
    
    let btnFinalizarCompra = document.getElementById("btnFinalizarCompra");

    btnFinalizarCompra.addEventListener('click',()=>{
        const total = carrito.reduce((acc,c) => acc + c.precio,0);
        Swal.fire(
            'Su compra se realizo con Exito!',
            `El monto total es: ${total}`,
            'success'
          )
    })
}


let btnIconEcomercce = document.getElementById("btnIconEcomercce");

/*Mostrar/Ocultar Div Carrito*/
btnIconEcomercce.addEventListener('click',()=>{

    Divcarrito.classList = Divcarrito.classList[1] == "inv" ? " vis CardCarrito  animate__animated animate__fadeInRight" : "  CardCarrito inv  animate__animated animate__fadeInLeft";
})


/*Filtrar productos */

let formFiltro = document.getElementById("formFiltros");
console.log(formFiltro)

formFiltro.addEventListener("submit",e=>{
    filtrarProductos(e)
})

const filtrarProductos = e=>{
    e.preventDefault();

   
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


    contenedorMain.innerHTML = "";
    prodFiltrado.forEach( ({nombre,precio,id}) => {
        const section = document.createElement('section');
        section.innerHTML += `
        <h3>${nombre}</h3>
        <img src="imgs/mother.webp" alt="" width="250px" height="180px">
        <div class="addProducto"> 
            <h4>${precio}</h4>
            <button id=agregar${id} class="iconAdd"><i class="fas fa-plus-circle"></i></button>
        </div>`;
    
        contenedorMain.appendChild(section);
        const boton = document.getElementById(`agregar${id}`);
    
            boton.addEventListener('click',()=>{
            agregarCarrito(id);
        });
    })
    Divcarrito.classList = "CardCarrito inv  animate__animated animate__fadeInLeft";

}

setTimeout(() =>{
    localStorage.getItem("listaCompra") ?? localStorage.setItem("listaCompra",JSON.stringify(carrito));
    recuperarLocalStorage();
    
},1000);




