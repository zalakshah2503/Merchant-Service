namespace Model {
    export class Category {
        CategoryId: number;
        GroupParamTypeId: number;
        BrandParamTypeId: number;
        SupplierId: number;
        SupplierCount: number;
        CategoryCreatedDateTime: Date;

        ItemSupplier: Array<Model.ItemSupplier>;
    }
}