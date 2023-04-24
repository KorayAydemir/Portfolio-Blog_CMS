import { ListItemBuilder, StructureBuilder, StructureResolver, } from "sanity/desk";
import { createClient } from "@sanity/client";


const ignoredDocTypes: string[] = ['comment']

const options = {
    dataset: 'production',
    projectId: 'j13exjw5',
    useCdn: false,
    apiVersion: "2023-05-07"
}

const client = createClient(options)

export const testStructure: StructureResolver = async (S, context?) => {
    return S.list()
        .title('Documents')
        .items(
            [
                ...S.documentTypeListItems().filter(
                    (listItem: ListItemBuilder) => (!ignoredDocTypes.includes(listItem.getId() ?? ''))
                ),
                S.listItem()
                    .title('Comments').child(
                        S.list().title('Status').items(await commentFilters(S))
                    ),
            ]
        )
}

const commentFilters = async (S: StructureBuilder) => {
    let slugs = new Set();
    slugs = await client.fetch('*[_type == "comment"].post')
    let uniqueSlugs = [...new Set(slugs)]

    const postsThatHaveComments = (approvedStatus: string) => (
        uniqueSlugs.map((slug: any) => (
            S.listItem().title(slug).child(() => (
                S.documentList()
                    .title('Comments')
                    .filter(`_type == "comment" && post == '${slug}' && approved == ${approvedStatus}`)),
            )
        )
        ))

    console.log(uniqueSlugs)
    return ([
        S.listItem().title("Pending").child(S.list().title('Posts').items(postsThatHaveComments("undefined"))),
        S.listItem().title("Disapproved").child(S.list().title('Posts').items(postsThatHaveComments("false"))),
        S.listItem().title("Approved").child(S.list().title('Posts').items(postsThatHaveComments("true"))),
    ])
}

