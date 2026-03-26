export const getInitials = (name) => {
  if (!name) return ""
  const words = name.split(" ")
  let initials = ""
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0]
  }
  return initials.toUpperCase()
}

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Note color configuration
export const NOTE_COLORS = {
  default: {
    bg: "bg-white dark:bg-[#1a1d2e]",
    border: "border-slate-200 dark:border-[#2d3154]",
    dot: "bg-slate-300 dark:bg-slate-600",
    label: "Default",
  },
  red: {
    bg: "bg-red-50 dark:bg-[#3d1f1f]",
    border: "border-red-200 dark:border-red-900/50",
    dot: "bg-red-400",
    label: "Red",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-[#3d2d1a]",
    border: "border-orange-200 dark:border-orange-900/50",
    dot: "bg-orange-400",
    label: "Orange",
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-[#3a3a1a]",
    border: "border-yellow-200 dark:border-yellow-900/50",
    dot: "bg-yellow-400",
    label: "Yellow",
  },
  green: {
    bg: "bg-green-50 dark:bg-[#1a3d2a]",
    border: "border-green-200 dark:border-green-900/50",
    dot: "bg-green-400",
    label: "Green",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-[#1a3535]",
    border: "border-teal-200 dark:border-teal-900/50",
    dot: "bg-teal-400",
    label: "Teal",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-[#1a2a3d]",
    border: "border-blue-200 dark:border-blue-900/50",
    dot: "bg-blue-400",
    label: "Blue",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-[#2d1a3d]",
    border: "border-purple-200 dark:border-purple-900/50",
    dot: "bg-purple-500",
    label: "Purple",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-[#3d1a2d]",
    border: "border-pink-200 dark:border-pink-900/50",
    dot: "bg-pink-400",
    label: "Pink",
  },
}

export const getColorClasses = (color) => {
  return NOTE_COLORS[color] || NOTE_COLORS.default
}

// Strip markdown syntax for plain text preview
export const stripMarkdown = (text) => {
  if (!text) return ""
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/```[\s\S]*?```/g, "[code]")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/^---+$/gm, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .trim()
}

// Simple markdown to HTML renderer
export const renderMarkdown = (text) => {
  if (!text) return ""

  let html = text
    // Escape HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  // Code blocks (before inline code)
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>")

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>")
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>")
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>")

  // Horizontal rule
  html = html.replace(/^---+$/gm, "<hr>")

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")

  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>")

  // Unordered list items
  html = html.replace(/^[-*+] (.+)$/gm, "<li>$1</li>")
  html = html.replace(/(<li>[\s\S]+?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)

  // Ordered list items
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>")

  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // Paragraphs — wrap lines not starting with HTML tags
  html = html
    .split("\n")
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return ""
      if (/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|p)/.test(trimmed)) return trimmed
      return `<p>${trimmed}</p>`
    })
    .filter((line) => line !== "")
    .join("\n")

  return html
}
