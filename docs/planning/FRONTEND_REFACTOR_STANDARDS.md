Frontend Refactor Standards

1. General Principles

* Prioritize readability over cleverness.
* Prefer composition over inheritance.
* Keep components small and focused.
* Avoid premature optimization.
* Refactor without changing business behavior unless explicitly required.
* Remove dead code, unused imports, unused variables, and commented code.
* Keep the codebase predictable and consistent.

⸻

2. Project Structure

* Organize files by feature/domain instead of file type when possible.
* Co-locate related files:
    * component
    * styles
    * hooks
    * tests
    * types
* Avoid deeply nested folders.
* Use absolute imports or configured aliases instead of long relative paths.

Example:

src/
  features/
    auth/
      components/
      hooks/
      services/
      types/

⸻

3. React Component Standards

* Prefer functional components.
* Use named exports unless there is a strong reason for default exports.
* One component per file.
* Keep components under ~200 lines when practical.
* Extract complex UI into smaller reusable components.
* Avoid prop drilling when context or composition is cleaner.
* Keep JSX clean and readable.

Example:

export function UserCard() {
  return <div />;
}

⸻

4. State Management

* Keep state as local as possible.
* Avoid unnecessary global state.
* Derived state should not be duplicated.
* Prefer React Query/TanStack Query for server state.
* Avoid excessive useEffect usage.
* Avoid state mutations.

⸻

5. Hooks

* Prefix all hooks with use.
* Hooks must follow single responsibility.
* Avoid hooks with excessive side effects.
* Extract reusable logic into custom hooks.
* Keep hooks predictable and testable.

Example:

function useUserProfile() {}

⸻

6. TypeScript Standards

* Avoid any whenever possible.
* Prefer explicit types for public APIs.
* Use interfaces for object contracts when appropriate.
* Use type inference when readability is not affected.
* Prefer union types over magic strings.
* Centralize shared types.

Avoid:

const data: any = response;

Prefer:

interface User {
  id: string;
  name: string;
}

⸻

7. Styling Standards

* Prefer Tailwind utility classes consistently.
* Avoid inline styles unless dynamic.
* Reuse UI primitives/components.
* Keep styling patterns consistent.
* Avoid duplicated class combinations.

⸻

8. File Naming

* Components: PascalCase.tsx
* Hooks: useSomething.ts
* Utilities: camelCase.ts
* Types: types.ts
* Constants: constants.ts

Examples:

UserCard.tsx
useAuth.ts
formatCurrency.ts

⸻

9. Import Rules

* Remove unused imports.
* Group imports consistently:
    1. React
    2. Third-party libraries
    3. Internal modules
    4. Styles/types
* Prefer absolute imports.

Example:

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

⸻

10. API & Data Fetching

* Separate API logic from UI components.
* Do not fetch directly inside deeply nested UI components.
* Normalize API response handling.
* Centralize API clients/services.

Prefer:

services/
api/
queries/

⸻

11. Error Handling

* Handle loading, empty, and error states explicitly.
* Avoid silent failures.
* Provide meaningful error messages.
* Never leave unresolved promises unhandled.

⸻

12. Performance

* Avoid unnecessary re-renders.
* Memoize only when beneficial.
* Lazy load large routes/components.
* Avoid large monolithic components.
* Optimize expensive computations.

⸻

13. Forms

* Centralize validation logic.
* Use schema validation when possible.
* Keep form state predictable.
* Avoid duplicated validation rules.

⸻

14. Accessibility

* Use semantic HTML.
* Add labels to form elements.
* Ensure keyboard accessibility.
* Avoid clickable divs when buttons should be used.
* Ensure sufficient contrast and focus visibility.

⸻

15. Testing

* Test behavior, not implementation details.
* Prefer integration tests for user flows.
* Keep tests readable and maintainable.
* Remove flaky tests.

⸻

16. Refactor Rules

* Do not refactor unrelated code.
* Preserve existing functionality.
* Make incremental improvements.
* Avoid massive unreviewable changes.
* Prefer small focused commits.

⸻

17. Code Smells to Eliminate

* Duplicate logic
* Massive components
* Deep prop drilling
* Nested ternaries
* Magic numbers/strings
* Overly complex useEffect
* Repeated API calls
* Dead code
* Unused state
* Excessive boolean props

⸻

18. Documentation

* Add comments only when necessary.
* Prefer self-documenting code.
* Document complex business rules.
* Keep README and setup instructions updated.

⸻

19. Git Standards

* Keep commits focused and atomic.
* Use meaningful commit messages.
* Avoid committing temporary debugging code.
* Rebase/squash appropriately before merge.

Example:

feat: extract auth modal into reusable component
refactor: simplify dashboard state handling
fix: prevent duplicate invoice requests

⸻

20. Final Refactor Checklist

Before submitting:

* No TypeScript errors
* No ESLint errors
* No unused imports/variables
* No console.logs left behind
* Components remain readable
* Existing functionality preserved
* Responsive behavior preserved
* Accessibility maintained
* Performance not degraded
* Naming consistency maintained