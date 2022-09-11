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