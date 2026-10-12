import { ProjectModel, SchedulerPro } from '@bryntum/schedulerpro';

// Both files hold the same 7 resources. seven-events.json has one event per resource, no-events.json has none.
const project = new ProjectModel({
    lazyLoad  : true, // without it, all 7 bars come back
    transport : { load : { url : '/seven-events.json', method : 'GET' } }
});

const loadFrom = async url => {
    project.transport.load.url = url;
    await project.load();
    await project.commitAsync();
    const orphans = project.assignmentStore.records.filter(assignment => !assignment.resource).length;
    log(`${url}: ${project.eventStore.count} events, ${orphans} assignments without a resource`);
};

new SchedulerPro({
    appendTo  : 'container',
    project,
    startDate : '2026-01-01',
    endDate   : '2026-01-15',
    columns   : [{ text : 'Employee', field : 'name', width : 160 }],
    tbar      : [
        { type : 'button', text : '1. Load no events', onClick : () => loadFrom('/no-events.json') },
        { type : 'button', text : '2. Load the 7 events again', onClick : () => loadFrom('/seven-events.json') }
    ]
});

const log = message => { document.getElementById('log').textContent += `${message}\n`; };

window.loadFrom = loadFrom;
await loadFrom('/seven-events.json');
window.ready = true;
