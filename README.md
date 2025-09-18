# Accessible Pagination ♿️

A lightweight, fully accessible pagination component built with React and TypeScript. Designed with inclusivity in mind, this component offers robust keyboard navigation and screen reader support, making it ideal for WCAG 2.1 AA-compliant web applications.

---

## ✨ Features

- ♿️ **Accessibility-first** design (WCAG 2.1 AA)
- ⌨️ Full **keyboard navigation** (arrow keys, tab, enter)
- 🧏‍♂️ Screen reader friendly (ARIA labels and roles)
- ⚛️ React + TypeScript compatible
- 💡 Lightweight and framework-agnostic

---

## 🚀 Live Demo

[🔗 Accessible Pagination page](https://accessible-pagination.vercel.app/)

---

## 📦 Installation

```bash
npm install accessible-pagination
```

---

## 🧑‍💻 Usage

```tsx
import { AccessiblePagination } from "accessible-pagination";

<AccessiblePagination
  totalPages={10}
  currentPage={2}
  onPageChange={(page) => console.log("Selected:", page)}
/>;
```

---

## 🧪 Accessibility

- Follows **WAI-ARIA** practices
- Uses `aria-label`, `aria-current`, and semantic elements
- Tested with:
  - keyboard
  - ✅ Screen readers (VoiceOver, NVDA)


---

## 🔧 Props

| Prop           | Type     | Description                             |
|----------------|----------|-----------------------------------------|
| `totalPages`   | `number` | Total number of pages                   |
| `currentPage`  | `number` | Current active page                     |
| `onPageChange` | `func`   | Callback function when page changes     |

---

## 🤝 Contributing

Pull requests, feedback, and accessibility suggestions are welcome!  
Check [open issues](https://github.com/micaavigliano/accessible-pagination/issues) or open a discussion.

---

## 🙋‍♀️ About the Author

Created with ❤️ by [Micaela Avigliano](https://github.com/micaavigliano)  
Frontend Developer & Accessibility Advocate  
→ [Portfolio](https://micaavigliano.com)
