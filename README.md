# Lazy-loaded project: reloading after an empty load paints only one event

Minimal repro for a question on the Bryntum forum. Scheduler Pro 7.3.7, plain JS + Vite, the stock `AjaxTransport`
reading two static JSON files.

## Run

```sh
npm install   # needs access to npm.bryntum.com (licensed or trial account)
npm run dev
```

Open the URL Vite prints. The 7 events show, one per resource.

1. Click **1. Load no events**. The project loads `no-events.json`: same 7 resources, no events. The view is empty.
2. Click **2. Load the 7 events again**. The project loads `seven-events.json` again.

Only one event bar comes back, out of 7. The log under the scheduler shows 7 events and 6 assignments without a
resource. Each assignment still has its `resourceId`, and that resource is in the store.

![Only one bar after the reload](screenshots/after-reload.png)

`npm run repro` (in a second terminal) clicks both buttons headless and prints the bar counts.

## What changes the result

- Remove `lazyLoad: true`: all 7 bars come back.
- Load the 7 events twice in a row, without the empty load in between: all 7 bars come back.
- Reload through `project.resourceStore.load()` instead of `project.load()` (what our app does): same result, one bar.

## Workaround we use

After the load, relink the orphans and repaint:

```js
for (const assignment of project.assignmentStore.records.filter(a => !a.resource)) {
    assignment.resource = assignment.resourceId;
}
await project.commitAsync();
scheduler.refreshRows();
```

Is this a bug, or is there a setting we are missing?
