export const theme = {
  colors: {
    primary: "bg-blue-500",
    background: "bg-white",

    highlight: "bg-blue-500",
    secondary: "bg-gray-100",
    selected: "bg-gray-200",
    text: "text-gray-900",
    text_alt: "text-white",
    muted: "text-gray-500",
    muted_alt: "text-gray-300",
    deleted: "text-white/60",
    border: "border-slate-300",
    border_light: "border-slate-200",
  },

  profile: {
    background: "bg-blue-300",
    border: "border-gray-200",
    online: "bg-green-500",
    offline: "bg-white",
  },

  predefined: {
    input: "bg-[#EDEFF3] focus:outline-none focus:ring-2 focus:ring-slate-300",
    loading: "border-gray-300 border-t-blue-500",
  },

  input: {
    bg: "bg-[#EDEFF3]",
    bg_2: "bg-gray-100",
  },

  predefined_inputs: {
    normal:
      "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-300",
  },

  message: {
    sent: "bg-blue-500 text-white",
    received: "bg-gray-700 text-gray-900",
  },

  typing: {
    container:
      "flex items-center gap-2 rounded-full border border-slate-200 bg-gray-100 px-3 py-1.5 shadow-sm",

    text:
      "text-xs font-medium text-gray-500",

    dot:
      "h-1.5 w-1.5 rounded-full bg-slate-400",
  },

  newMessages: {
    container:
      "my-1 flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 shadow-sm",

    text:
      "text-xs font-medium text-blue-600",
  },

  radius: {
    default: "rounded-lg",
    bubble: "rounded-2xl",
  },

  buttons: {
    primary:
      "mx-2 cursor-pointer rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600",

    secondary_alt:
      "cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100",

    secondary:
      "cursor-pointer rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800",
  },
};
