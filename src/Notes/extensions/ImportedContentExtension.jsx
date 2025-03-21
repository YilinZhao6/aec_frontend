import { Mark } from '@tiptap/core'

export const ImportedContentExtension = Mark.create({
  name: 'importedContent',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.imported-content',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { ...this.options.HTMLAttributes, class: 'imported-content', ...HTMLAttributes }, 0]
  },

  addCommands() {
    return {
      setImportedContent: () => ({ commands }) => {
        return commands.setMark(this.name)
      },
      toggleImportedContent: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      },
      unsetImportedContent: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
})