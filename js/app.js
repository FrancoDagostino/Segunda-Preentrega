

class Productos{
    constructor (id,nombre,precio,stock,img,cantidad,categoria){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.vendido = false;
        this.stock = stock
        this.img = img
        this.cantidad = cantidad
        this.categoria = categoria
    }
    
    sumaIva(){
        this.precio = this.precio * 1.21;
    }

    }
    class ListaCompra{
        constructor(id,lista,metodopago,descuento){
                this.id = id;
                this.lista = lista;
                this.metodopago = metodopago;
                this.descuento = descuento;
            }
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
    const divItems = document.querySelector(".Card");
    const productosFinalizar = document.querySelector(".productosComprar");
    const cardFinalizarCompra = document.querySelector(".cardFinalizarCompra");
    const cuotas = document.getElementById("cuotas");
    const formFinCompra = document.getElementById("formFinCompra");
    /* Consumir API Producto*/
    
    
const apiProductos = async() =>{
        
        const response = await fetch(`https://restserver-node-producto.herokuapp.com/api/productos`);

        const {producto} = await response.json();

        producto.forEach(dp => {
            productos.push(new Productos(dp._id,dp.nombre.toString(),dp.precio,dp.stock,dp.img,0,dp.categoria))
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
            agregarCarrito(id,true);
        }); 
    })

    const recuperarLocalStorage = () => {

        if(localStorage != null && localStorage.getItem("listaCompra") != "" ){
    
            let localCarrito = JSON.parse(localStorage.getItem("listaCompra"));
            acumCarr = JSON.parse(localStorage.getItem("cantidad"));
            cantProd.innerHTML = acumCarr;
            localCarrito.forEach(({id,cantidad}) => {
                agregarCarrito(id,false,cantidad)
            })
        }
    }
    localStorage.getItem("listaCompra") ?? localStorage.setItem("listaCompra",JSON.stringify(carrito));
    recuperarLocalStorage();
    
}



const agregarCarrito = (productoId,add=false,cantidad=0) =>{
    const item = productos.find(p => p.id === productoId)
    if(add == true){
        acumCarr++;
        item.cantidad++;
        localStorage.setItem("cantidad", JSON.stringify(acumCarr));
    }else{
        item.cantidad = cantidad
    }
    carrito.push(item);
    cantProd.innerHTML = `${acumCarr}`;
    carrito = [...new Set(carrito)];
    actualizaCarrito();
}

const eliminarCarrito= (productoId)=>{
    const item = carrito.find(c => c.id === productoId);
    let indice = carrito.indexOf(item);
    carrito.splice(indice,1);
    acumCarr -= item.cantidad;
    item.cantidad = 0;
    localStorage.setItem("cantidad", JSON.stringify(acumCarr));
    cantProd.innerHTML = `${acumCarr}`;
    if(acumCarr == 0){
        cantProd.innerHTML = "";
        localStorage.setItem("cantidad", JSON.stringify(""));
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
    carrito.forEach(({nombre,precio,id,img,cantidad}) => {
        carritoHTML.innerHTML+=`
        <hr/>
        <section>
        <img src="${img}" alt="" width="150px" height="90px">
        <div class="addProducto"> 
            <h3>${nombre}</h3>
            <h4>$ ${precio * cantidad}</h4>
            <h4>Cantidad:${cantidad}</h4>
            </div>
            <button onclick="eliminarCarrito('${id}')" class="iconAdd"><i class="fas fa-trash"></i></button>
        </section>`;
    })
    localStorage.setItem("listaCompra", JSON.stringify(carrito));
    const total = carrito.reduce((acc,c) => acc + (c.cantidad * c.precio),0);
    carritoHTML.innerHTML+=`
    <hr>
    <div class="finalizarCompra">
        <h3 class="carritoTotal">TOTAL $ ${total.toFixed(2)}</h3>
        <button id="btnFinalizarCompra" class="btnSuccess">Finalizar Compra</button>
    </div>
    `;
    
    let btnFinalizarCompra = document.getElementById("btnFinalizarCompra");

    btnFinalizarCompra.addEventListener('click',()=>{
        finalizarCompra(total);
    })
}


let btnIconEcomercce = document.getElementById("btnIconEcomercce");

/*Mostrar/Ocultar Div Carrito*/
btnIconEcomercce.addEventListener('click',()=>{

    Divcarrito.classList = Divcarrito.classList[1] == "inv" ? " vis CardCarrito  animate__animated animate__fadeInRight" : "  CardCarrito inv  animate__animated animate__fadeInLeft";
})


/*Filtrar productos */

let formFiltro = document.getElementById("formFiltros");

formFiltro.addEventListener("submit",e=>{
    filtrarProductos(e)
})

const filtrarProductos = e=>{
    e.preventDefault();

   
    let categoriaFiltrar
    if(document.getElementById("Placa_Madre").checked){
        categoriaFiltrar = document.getElementById("Placa_Madre").value;
    }
    
    if(document.getElementById("cpu").checked){
        
        categoriaFiltrar = document.getElementById("cpu").value;
    } 

    if(document.getElementById("Memoria_RAM").checked){
        
        categoriaFiltrar = document.getElementById("Memoria_RAM").value;
    } 

    if(document.getElementById("Tarjeta_Grafica").checked){
        
        categoriaFiltrar = document.getElementById("Tarjeta_Grafica").value;
    } 



    let prodFiltrado = productos.filter(p => p.categoria == categoriaFiltrar);

    contenedorMain.innerHTML = "";
    prodFiltrado.forEach( ({nombre,precio,id,img}) => {
        const section = document.createElement('section');
        section.innerHTML += `
        <h3>${nombre}</h3>
        <img src="${img}" alt="" width="250px" height="180px">
        <div class="addProducto"> 
            <h4>${precio}</h4>
            <button id=agregar${id} class="iconAdd"><i class="fas fa-plus-circle"></i></button>
        </div>`;
    
        contenedorMain.appendChild(section);
        const boton = document.getElementById(`agregar${id}`);
    
            boton.addEventListener('click',()=>{
            agregarCarrito(id,true);
        });
    })
    Divcarrito.classList = "CardCarrito inv  animate__animated animate__fadeInLeft";

}

const finalizarCompra = (total) => {
        cardFinalizarCompra.classList = "cardFinalizarCompra mostrarListaCompra"

          Divcarrito.classList = "CardCarrito inv  animate__animated animate__fadeInLeft";
          divItems.classList.toggle("ocultarItems")
          let localCarrito = JSON.parse(localStorage.getItem("listaCompra"));
          localCarrito.forEach(({nombre,precio,id,img,cantidad}) => {
            productosFinalizar.innerHTML+=`
            <section>
            <img src="${img}" alt="" width="150px" height="90px">
            <div class="addProducto"> 
            <h3>${nombre}</h3>
            <h4>$ ${precio * cantidad}</h4>
            <h4>Cantidad:${cantidad}</h4>
            </div>
            </section>
            <hr/>
            `;
        })
        productosFinalizar.innerHTML+=`
        <div class="finalizarCompra">
            <h3 class="carritoTotal">TOTAL $ ${total.toFixed(2)}</h3>
        </div>
        `;
        cuotas.innerHTML=`
        <option value="1">1 Pagos de $ ${total.toFixed(2)}</option>
        <option value="3">3 Pagos de $ ${total / 3}</option>
        <option value="6">6 Pagos de $ ${total /6}</option>
        <option value="12">12 Pagos de $ ${total /12}</option>
        `
        $(document).ready(function (){
            $("#btnFinalizar").click((e)=>{
                let totalCuotas = total / parseFloat($('#cuotas').val())
                e.preventDefault();
                Swal.fire({
                    title: `Gracias por elegirnos ${$("#nombre").val()}`,
                    text: `El pago fue realizado con Éxito
                            Corrobora las instrucciones de retiro en tu corrreo: ${$("#email").val()}
                            Pagaste ${total.toFixed(2)} en ${$('#cuotas').val()} cuota de: ${totalCuotas.toFixed(2)}`,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.clear();
                        carritoHTML.innerHTML = "";
                        cantProd.innerHTML="";
                        location.reload()
                    }
                  })

            })
        })

}       

mostrarProductos();




