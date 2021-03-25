# Forge Priority Checklists

This project is a custom Forge app that allows Jira projects to use a "Priority Checklist" system to quickly rank and prioritize items in their backlog.

The "Priority Checklist" system uses a basic checklist, generally of fewer than 10 items, to evaluate the priority of a task. The items in the checklist are determined by the team and should be a mix of design, development, strategic and other concerns; the number checked off for a given ticket is the final score. It is intended to allow rapid prioritization during issue creation or in a backlog refinement session, by anyone on the team. The priorities it generates are only as good as the checklist – but it can produced nuanced results when fine-tuned.

The filled-out checklist displays as a custom panel in the new Jira Issue View, and sets a custom field, "Priority Checklist Score". The checklist can be filled out by editing the panel or clicking on the custom field; the checklist itself can be configured in Jira project settings.

## Quick start

- Modify your app by editing the `src/index.jsx` file.

- Build and deploy your app by running:

```
forge deploy
```

- Install your app in an Atlassian site by running:

```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:

```
forge tunnel
```

### Notes

- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
