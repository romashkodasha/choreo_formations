import { ModalModel } from "./ModalModel";

export class UIStore {
    readonly teamCreateModal: ModalModel;
    readonly projectCreateModal: ModalModel;

    constructor() {
        this.teamCreateModal = new ModalModel();
        this.projectCreateModal = new ModalModel();
    }
}