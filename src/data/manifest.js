import { SCALE_MODES } from "pixi.js"

const manifest = {
    bundles: [
        {
            name: "map",
            assets: [
                {
                    name: "altar",
                    src: "/sprites/map/altar.png"
                },
                {
                    name: "combat",
                    src: "/sprites/map/combat.png"
                },
                {
                    name: "cursor0",
                    src: "/sprites/map/cursor0.png"
                },
                {
                    name: "cursor1",
                    src: "/sprites/map/cursor1.png"
                },
                {
                    name: "cursor2",
                    src: "/sprites/map/cursor2.png"
                },
                {
                    name: "cursor3",
                    src: "/sprites/map/cursor3.png"
                },
                {
                    name: "cursor4",
                    src: "/sprites/map/cursor4.png"
                },
                {
                    name: "cursor5",
                    src: "/sprites/map/cursor5.png"
                },
                {
                    name: "cursor6",
                    src: "/sprites/map/cursor6.png"
                },
                {
                    name: "cursor7",
                    src: "/sprites/map/cursor7.png"
                },
                {
                    name: "cursor8",
                    src: "/sprites/map/cursor8.png"
                },
                {
                    name: "cursor9",
                    src: "/sprites/map/cursor9.png"
                },
                {
                    name: "elite",
                    src: "/sprites/map/elite.png"
                },
                {
                    name: "event",
                    src: "/sprites/map/event.png"
                },
                {
                    name: "exit",
                    src: "/sprites/map/exit.png"
                },
                {
                    name: "pathbottom",
                    src: "/sprites/map/pathbottom.png"
                },
                {
                    name: "pathright",
                    src: "/sprites/map/pathright.png"
                },
                {
                    name: "pathtop",
                    src: "/sprites/map/pathtop.png"
                },
                {
                    name: "selected0",
                    src: "/sprites/map/selected0.png"
                },
                {
                    name: "selected1",
                    src: "/sprites/map/selected1.png"
                },
                {
                    name: "selected2",
                    src: "/sprites/map/selected2.png"
                },
                {
                    name: "selected3",
                    src: "/sprites/map/selected3.png"
                },
                {
                    name: "selected4",
                    src: "/sprites/map/selected4.png"
                },
                {
                    name: "selected5",
                    src: "/sprites/map/selected5.png"
                },
                {
                    name: "selected6",
                    src: "/sprites/map/selected6.png"
                },
                {
                    name: "selected7",
                    src: "/sprites/map/selected7.png"
                },
                {
                    name: "selected8",
                    src: "/sprites/map/selected8.png"
                },
                {
                    name: "selected9",
                    src: "/sprites/map/selected9.png"
                },
                {
                    name: "shop",
                    src: "/sprites/map/shop.png"
                },
                {
                    name: "treasure",
                    src: "/sprites/map/treasure.png" 
                },
            ],
        },
        {
            name: "battle",
            assets: [
                {
                    name: "border",
                    src: "/sprites/battle/tiles/border.png"
                },
                {
                    name: "ground",
                    src: "/sprites/battle/tiles/ground.png"
                },
                {
                    name: "sideborder",
                    src: "/sprites/battle/tiles/sideborder.png"
                },
                {
                    name: "border",
                    src: "/sprites/battle/tiles/border.png"
                },
                {
                    name: "sidecornerborderleft",
                    src: "/sprites/battle/tiles/sidecornerborderleft.png"
                },
                {
                    name: "sidecornerborderright",
                    src: "/sprites/battle/tiles/sidecornerborderright.png"
                },
                {
                    name: "sidecornerleft",
                    src: "/sprites/battle/tiles/sidecornerleft.png"
                },
                {
                    name: "sidecornerright",
                    src: "/sprites/battle/tiles/sidecornerright.png"
                },
                {
                    name: "sideground",
                    src: "/sprites/battle/tiles/sideground.png"
                },
                {
                    name: "wall",
                    src: "/sprites/battle/tiles/wall.png"
                },
                {
                    name: "empty",
                    src: "/sprites/battle/units/empty.png"
                },
                {
                    name: "orc0",
                    src: "/sprites/battle/units/orc0.png"
                },
                {
                    name: "orc1",
                    src: "/sprites/battle/units/orc1.png"
                },
            ]
        }
    ]
}

manifest.bundles.forEach(bundle => {
    bundle.assets.forEach(asset => {
        asset.data = {scaleMode: SCALE_MODES.NEAREST}
    })
})

export default manifest