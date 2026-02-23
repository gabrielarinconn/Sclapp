# Contributing to SCLAPP

## Branching Strategy

- main → Stable production-ready code.
- develop → Integration branch.
- feature/* → New features.
- fix/* → Bug fixes.

## Workflow

1. Create a new branch from develop:
   git checkout develop
   git checkout -b feature/your-feature-name

2. Make small and clear commits:
   feat: add companies endpoint
   fix: prevent duplicate technologies

3. Push your branch:
   git push origin feature/your-feature-name

4. Create a Pull Request to develop.

5. At least one team member must review before merging.

## Rules

- Never push directly to main.
- Keep commits small and descriptive.
- Test before merging.