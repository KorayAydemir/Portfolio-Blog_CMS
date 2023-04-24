import { defineConfig, isDev } from 'sanity'
import { visionTool } from '@sanity/vision'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemas'
import { getStartedPlugin } from './plugins/sanity-plugin-tutorial'
import { testStructure } from './structures/testStructure'

const devOnlyPlugins = [getStartedPlugin()]

export default defineConfig({
    name: 'default',
    title: 'violet-fly',

    projectId: 'j13exjw5',
    dataset: 'production',

    plugins: [deskTool({
        structure: (S) => testStructure(S)
    }),
    visionTool(), ...(isDev ? devOnlyPlugins : [])],

    schema: {
        types: schemaTypes,
    },
})

