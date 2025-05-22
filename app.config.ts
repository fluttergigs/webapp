export default defineAppConfig({
  ui: {
    colors: {
      primary: 'indigo',
      ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
    },
    avatar: {
      background: 'bg-indigo-600',
      text: 'text-white',
    },

    button: {
      slots: {
        base: [
          'rounded-lg font-medium inline-flex items-center cursor-pointer disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75',
          'transition-colors',
        ],
      },
      icon: {
        size: {
          '2xl': 'h-8 w-8',
        },
      },
    },
    dropdown: {
      container: 'z-[500]',
    },
  },
  /*ui: {
      strategy: "override",
      primary: "cool",
      avatar: {
          size: {
              xl: "h-32 w-32",
          },
      },
      card: {
          background: "bg-transparent",
          divide: "divide-none",
          ring: "ring-0 ",
          base: "border-b border-gray-600 ",
          rounded: "rounded-none",
      },
      tabs: {
          list: {
              rounded: "rounded-none",
              background: "bg-transparent",
              base: "border-b border-gray-600",
              marker: {
                  base: "w-full h-full",
                  background: "bg-transparent",
              }
          },
      },
  },
  container: {
      padding: "pa-0",
  },*/
});
