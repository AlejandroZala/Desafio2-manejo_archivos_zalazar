import fs from 'fs';

class ProductManager {
    constructor() {
        this.products = [];
        this.path = "./products.json";
        this.last_id = 1;
    }

    //--inicializacón archivo
    initialize = async () => {
        const productsJson = JSON.stringify(this.products);
        await fs.promises.writeFile(this.path, productsJson);
    };

    //--Valida y agrega productos como array de objetos a productos.josn
    addProduct = async (newProduct) => {
        try {
            //--Verifico el ingreso completo de todos los datos
            if (!newProduct.title ||
                !newProduct.description ||
                !newProduct.price ||
                !newProduct.thumbnail ||
                !newProduct.code ||
                !newProduct.stock
            ) {
                console.log("Datos ingresados incompletos");
                return null;
            }

            //--Verifico que code no exista previamente
            const exists = this.products.find(p => p.code === newProduct.code);

            if (exists) {
                return null;
            }

            // Asigna id al nuevo producto
            newProduct.id = this.last_id;

            // Actualizo el last_id
            this.last_id = this.last_id + 1;
            this.products.push(newProduct);

            const dataJson = JSON.stringify(this.products,null,'\t');
            const data = await fs.promises.writeFile(this.path, dataJson);

            return data;
        } catch (error) {
            console.log(error);
        }
    }

//--Lee archivo productos.json y devuelve todos sus elementos como array
    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const cart = JSON.parse(data);
            return cart;
        }
        return this.products;
    }

//--Recibe un id, lee productos.json y busca el producto segun id y lo devuelve como objeto
    getProductById = async (_id) => {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const cart = JSON.parse(data);
        const product = cart.find(p => p.id === _id);
        if (product) {
            return product;
        } else {
            console.error("Not found");
            return null;
        }
    }

    //--Actualiza producto, recibe:id, campo, nuevo valor
    updateProduct = async (_id, atribute, value) => {
        const id_buscado = this.products.findIndex(p => p.id === _id);

        if (id_buscado < 0) {
            console.info(`No existe producto con id: ${_id}`);
            return null;
        }

        const selectedItem = this.products[id_buscado];
        selectedItem[atribute] = value;
        this.products[id_buscado] = selectedItem;

        const cartJson = JSON.stringify(this.products,null,'\t');
        await fs.promises.writeFile(this.path, cartJson);
    }

    //--Borra producto según id ingresado
    deleteProduct = async (_id) => {
        const res = this.products.filter(p => p.id !== _id);

        const cartJson = JSON.stringify(res,null,'\t');
        await fs.promises.writeFile(this.path, cartJson);

        this.products = res;
        return;
    }
}

class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        // validates if the product is complete
        if (!title ||
            !description ||
            !price ||
            !thumbnail ||
            !code ||
            !stock
        ) {
            console.log('Incomplete product data');
        }

        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

// --INSTANCIAS DE PRUEBA DE CADA METODO

const manager = new ProductManager();
await manager.initialize();
console.log(await manager.getProducts());

//---Carga de productos al arhivo productos.json
const product1 = new Product("Crema de limpieza", 'con arcilla', 2500, "Link imagen producto1", "c1", 20);
await manager.addProduct(product1);
const product2 = new Product("Crema nutritiva", 'con malba', 1500, "Link imagen producto2", "c2", 30);
await manager.addProduct(product2);
const product3 = new Product("Crema antiarrugas", 'con aloe Vera', 3000, "Link imagen producto3", "c3", 40);
await manager.addProduct(product3);
console.log(await manager.getProducts());

//--Carga producto con campo faltante (precio)
const product4 = new Product("Crema antiarrugas", 'con aloe Vera', "Link imagen producto3", "c3", 40);
await manager.addProduct(product4);

//--Cargo producto según el id ingresado
console.log(await manager.getProductById(1));

//--Actualizo el producto según el idy se modifica el valor del campo ingresado
await manager.updateProduct(3, 'title', 'Crema humectante');
console.log(await manager.getProducts());

//--Borro producto según id
await manager.deleteProduct(1);
console.log(await manager.getProducts());