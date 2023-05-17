import React from 'react'

export default {
    name: 'comment',
    type: 'document',
    title: 'Comment',
    liveEdit: true,
    fields: [
        {
            name: 'name',
            type: 'string',
            validation: (Rule: any) =>
                Rule.required()
                    .max(60)
                    .error("Name can't be longer than 60 characters."),
        },
        {
            title: 'Approved',
            name: 'approved',
            type: 'boolean',
            description: "Comments won't show on the site without approval",
        },
        {
            name: 'email',
            type: 'string',
            validation: (Rule: any) =>
                Rule.required()
                    .max(254)
                    .error("Email can't be longer than 60 characters.")
                    .min(5)
                    .error("Email can't be shorter than 5 characters."),
        },
        {
            name: 'comment',
            type: 'text',
            validation: (Rule: any) =>
                Rule.required()
                    .max(1024)
                    .error("Comment can't be longer than 1024 characters."),
        },
        {
            name: 'post',
            type: 'string',
        },
        {
            name: 'replies',
            type: 'array',
            title: 'Children',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'comment'}],
                    weak: true,
                },
            ],
        },
    ],
    preview: {
        select: {
            name: 'name',
            comment: 'comment',
            post: 'post',
        },
        prepare({name, comment, post}: any) {
            return {
                title: `${name} on ${post}`,
                subtitle: comment,
            }
        },
    },
}
