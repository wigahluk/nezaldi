module LogView exposing (..)

import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Messages exposing (Msg)
import MdlColors exposing (..)
import Maybe exposing (..)
import Nezaldi

(=>) = (,)

cardContent : List (Html msg) -> Html msg
cardContent children =
    div [ style [ "padding" => "20px" ] ] children

statusCode : Int -> Html msg
statusCode code =
    let
        color c =
            case c of
                2 -> blue
                3 -> green
                4 -> organge
                5 -> red
                _ -> secondaryText
    in
        div
        [ style
            [ "color" => color (code // 100)
            , "font-weight" => "500"
            , "font-size" => "125%"
            , "vertical-align" => "middle"
            , "position" => "relative"
            , "display" => "inline"
            ]
        ]
        [ text <| toString code ]

responseType : String -> Html msg
responseType t =
    div
        [ style
            [ "color" => secondaryText
            , "font-weight" => "400"
            , "margin" => "0 8px"
            , "display" => "inline"
            ]
        ]
        [ text t ]

sourcePath : String -> Html msg
sourcePath t =
    div
        [ style
            [ "color" => primaryText
            , "font-weight" => "400"
            , "display" => "inline"
            ]
        ]
        [ text t ]

sourcePathHeader : String -> Html msg
sourcePathHeader t =
    div
        [ style
            [ "color" => primaryText
            , "font-weight" => "300"
            , "font-size" => "125%"
            , "margin" => "0 8px"
            , "vertical-align" => "middle"
            , "display" => "inline"
            ]
        ]
        [ text t ]

transactionHeader : Nezaldi.Transaction -> Html Msg
transactionHeader model =
    div
        [ style
            [ "font-size" => "150%"
            , "padding" => "15px 5px"
            ]
        ]
        [ statusCode model.code
        , sourcePathHeader model.sourceUrl
        ]