const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api

export default class RuinsparkApplication extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: 'ruinspark-app-{id}',
        tag: 'form',
        classes: ['ruinspark'],
        window: {
            frame: true,
            positioned: true,
            title: "RUINSPARK_Application",
            icon: "fa-solid fa-note-sticky",
            minimizable: false,
            resizeable: true
        },
        form: {
            submitOnChange: false,
            closeOnSubmit: false,
        },
        position: {
            top: 300,
            left: 300,
            width: 650,
            height: 500,
            scale: 1.0
        }
    }
}