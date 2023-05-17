import {defineConfig, isDev} from 'sanity'
import {visionTool} from '@sanity/vision'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'
import {getStartedPlugin} from './plugins/sanity-plugin-tutorial'
import {testStructure} from './structures/testStructure'
import React, {useState} from 'react'

const devOnlyPlugins = [getStartedPlugin()]

export default defineConfig({
    name: 'default',
    title: 'violet-fly',

    projectId: 'j13exjw5',
    dataset: 'production',

    plugins: [
        deskTool({
            structure: (S) => testStructure(S),
        }),
        visionTool(),
        ...(isDev ? devOnlyPlugins : []),
    ],

    document: {
        actions: (prev, context) => {
            console.log(context)

            return prev.map((originalAction) =>
                originalAction.action === 'delete'
                    ? customDelete(originalAction, context)
                    : originalAction
            )
        },
    },

    schema: {
        types: schemaTypes,
    },
})

function customDelete(originalPublishAction, context) {
    const BetterAction = (props) => {
        const originalResult = originalPublishAction(props)
        const [dialogOpen, setDialogOpen] = React.useState(false)
        async function op() {
            const currDoc = await context
                .getClient({apiVersion: '2023-05-17'})
                .getDocument(context.documentId!)

            if (currDoc.replies.length > 0) {
                // References found, prevent deletion and display an error message
                throw new Error(
                    'Cannot delete document. It has references tied to it.'
                )
            }
            console.log(currDoc)
            console.log('Hello world!')
            // then delegate to original handler
            if (currDoc.replies.length === 0) {
                originalResult.onHandle()
            }
        }
        return {
            label: 'Sil',
            dialog: dialogOpen && {
                type: 'confirm',
                onCancel: alert('cnaclledd'),
                onConfirm: () => {
                    op()
                    alert('You confirmed!')
                },
            },
            message: 'Please confirm!',
            onHandle: async () => {
                setDialogOpen(true)
                // Add our custom functionality
                // const references = await context.fetch(
                //     `*[_ref in $documentIds]`,
                //     {documentIds}
                // )
            },

            ...originalResult,
        }
    }
    return BetterAction
}
