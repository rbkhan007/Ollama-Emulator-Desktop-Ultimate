import QtQuick 2.15

Item {
    id: root

    property alias text: label.text
    property alias font: label.font
    property alias horizontalAlignment: label.horizontalAlignment
    property alias verticalAlignment: label.verticalAlignment
    property alias wrapMode: label.wrapMode
    property alias elide: label.elide
    property int fontSize: 16
    property color fromColor: "#6c63ff"
    property color toColor: "#00d4aa"
    property bool animate: true

    implicitWidth: label.implicitWidth
    implicitHeight: label.implicitHeight

    Text {
        id: label
        anchors.fill: parent
        font.pixelSize: root.fontSize
        visible: false
    }

    ShaderEffect {
        anchors.fill: parent
        property variant source: label
        property color colorFrom: root.fromColor
        property color colorTo: root.toColor

        fragmentShader: "
            varying highp vec2 qt_TexCoord0;
            uniform sampler2D source;
            uniform lowp vec4 colorFrom;
            uniform lowp vec4 colorTo;
            void main() {
                lowp vec4 tex = texture2D(source, qt_TexCoord0);
                lowp vec3 grad = mix(colorFrom.rgb, colorTo.rgb, qt_TexCoord0.y);
                gl_FragColor = vec4(grad, tex.a);
            }
        "
    }
}
