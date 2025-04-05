import { Mark } from '@tiptap/core'

export const ImportedContentExtension = Mark.create({
  name: 'importedContent',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  // Add priority to ensure proper mark ordering
  priority: 1000,

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

  // Allow other marks to be applied within this mark
  inclusive: true,

  // Add key binding to handle Enter key
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (editor.isActive(this.name)) {
          editor.chain()
            .splitBlock()
            .unsetMark(this.name)
            .run()
          return true
        }
        return false
      }
    }
  }
})