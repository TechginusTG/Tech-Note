import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const spellCheckPluginKey = new PluginKey('spellCheck');

export const SpellCheckExtension = Extension.create({
  name: 'spellCheck',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: spellCheckPluginKey,
        state: {
          init() {
            return { matches: [] };
          },
          apply(tr, value) {
            const meta = tr.getMeta(spellCheckPluginKey);
            if (meta) {
              return meta;
            }
            // Map matches over document changes
            const mappedMatches = value.matches.map((match: any) => {
                const from = tr.mapping.map(match.from);
                const to = tr.mapping.map(match.to);
                if (from >= to) return null;
                return { ...match, from, to };
            }).filter(Boolean);

            return { matches: mappedMatches };
          },
        },
        props: {
          decorations(state) {
            const { matches } = this.getState(state);
            if (!matches || matches.length === 0) {
              return DecorationSet.empty;
            }

            const decorations = matches.map((match: any) => {
              return Decoration.inline(match.from, match.to, {
                class: 'spell-error',
                'data-spell-suggestion': match.replacements.map((r: any) => r.value).join(', '),
                'data-spell-message': match.message,
              });
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
