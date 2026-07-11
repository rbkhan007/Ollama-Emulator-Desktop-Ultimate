import QtQuick 2.15
import QtQuick.Layouts 1.15
import QtQuick.Controls 2.15

Rectangle {
    color: "transparent"

    signal registerSucceeded()

    ColumnLayout {
        anchors.centerIn: parent
        width: 360
        spacing: 20

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: "\u2728"
            font.pixelSize: 48
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: "Create Account"
            font: Theme.fontHeading
            font.pixelSize: 28
            color: Theme.textPrimary
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: "Sign up to get started"
            font: Theme.fontBody
            color: Theme.textSecondary
        }

        Item { Layout.preferredHeight: 10 }

        ColumnLayout {
            Layout.fillWidth: true
            spacing: 16

            Text {
                text: "Email"
                font: Theme.fontBody
                color: Theme.textPrimary
            }
            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 44
                radius: Theme.radiusMedium
                color: Theme.surface
                border.color: Theme.border
                border.width: 1

                TextInput {
                    id: regEmail
                    anchors.fill: parent
                    anchors.margins: 12
                    color: Theme.textPrimary
                    font: Theme.fontBody
                    verticalAlignment: Text.AlignVCenter
                    focus: true
                }
            }

            Text {
                text: "Password"
                font: Theme.fontBody
                color: Theme.textPrimary
            }
            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 44
                radius: Theme.radiusMedium
                color: Theme.surface
                border.color: Theme.border
                border.width: 1

                TextInput {
                    id: regPassword
                    anchors.fill: parent
                    anchors.margins: 12
                    color: Theme.textPrimary
                    font: Theme.fontBody
                    echoMode: TextInput.Password
                    verticalAlignment: Text.AlignVCenter
                }
            }

            Text {
                text: "Confirm Password"
                font: Theme.fontBody
                color: Theme.textPrimary
            }
            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 44
                radius: Theme.radiusMedium
                color: Theme.surface
                border.color: Theme.border
                border.width: 1

                TextInput {
                    id: regConfirm
                    anchors.fill: parent
                    anchors.margins: 12
                    color: Theme.textPrimary
                    font: Theme.fontBody
                    echoMode: TextInput.Password
                    verticalAlignment: Text.AlignVCenter
                }
            }
        }

        Item { Layout.preferredHeight: 10 }

        Button {
            Layout.fillWidth: true
            Layout.preferredHeight: 44
            text: "Create Account"
            flat: true
            contentItem: Text {
                text: parent.text
                color: "#ffffff"
                font: Theme.fontBody
                font.bold: true
                font.pixelSize: 15
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
            }
            background: Rectangle {
                radius: Theme.radiusMedium
                gradient: Gradient {
                    GradientStop { position: 0.0; color: Theme.accentPrimary }
                    GradientStop { position: 1.0; color: Theme.accentSecondary }
                }
            }
            onClicked: {
                if (regPassword.text !== regConfirm.text) {
                    console.warn("Passwords do not match")
                    return
                }
                try {
                    var result = apiClient.register(regEmail.text, regPassword.text)
                    registerSucceeded()
                } catch(e) {
                    console.warn("Registration failed:", e)
                }
            }
        }

        Button {
            Layout.alignment: Qt.AlignHCenter
            text: "Already have an account? Sign in"
            flat: true
            contentItem: Text {
                text: parent.text
                color: Theme.accentPrimary
                font: Theme.fontBody
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
            }
            background: null
        }
    }
}
