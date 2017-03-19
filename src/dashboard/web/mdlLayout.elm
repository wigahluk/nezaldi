module MdlLayout exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

(=>) = (,)

layout : List (Html msg) -> Html msg
layout children =
    div [
        class "mdl-layout mdl-layout--fixed-header"
        ] children

layoutHeader : String -> Html msg
layoutHeader title =
    header [
        class "mdl-layout__header"
        ] [
            div [
                class "mdl-layout__header-row"
            ] [
                span [
                    class "mdl-layout-title"
                ] [ text title ]
            ]
        ]

layoutContent : List (Html msg) -> Html msg
layoutContent children =
    div [
        class "mdl-layout__content"
        ]
        [
        div [
            class "mdl-grid"
            ]
            [
            div [
                class "mdl-cell mdl-cell--12-col"
                ]
                children
            ]
        ]