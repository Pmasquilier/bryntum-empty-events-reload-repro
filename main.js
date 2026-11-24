import { ProjectModel, Scheduler } from '@bryntum/scheduler-enterprise';

// no-events.json: 7 resources, no events. eight-events.json: the same 7 resources plus a new one (id 8) in the middle of the list, one event per resource.
const project = new ProjectModel({
    lazyLoad  : true, // without it, all 7 bars come back
    transport : { load : { url : '/eight-events.json', method : 'GET' } }
});

const loadFrom = async url => {
    project.transport.load.url = url;
    await project.load();
    await project.commitAsync();
    const orphans = project.assignmentStore.records.filter(assignment => !assignment.resource).length;
    log(`${url}: ${project.eventStore.count} events, ${orphans} assignments without a resource`);
};

new Scheduler({
    appendTo  : 'container',
    project,
    startDate : '2026-01-01',
    endDate   : '2026-01-15',
    columns   : [{ text : 'Employee', field : 'name', width : 160 }],
    tbar      : [
        { type : 'button', text : '1. Load no events', onClick : () => loadFrom('/no-events.json') },
        { type : 'button', text : '2. Load the 8 events again', onClick : () => loadFrom('/eight-events.json') }
    ]
});

const log = message => { document.getElementById('log').textContent += `${message}\n`; };

window.loadFrom = loadFrom;
await loadFrom('/eight-events.json');
window.ready = true;
