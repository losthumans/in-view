import test from 'ava';
import Registry from '../src/registry';

test('Registry.off removes all handlers', t => {

    let registry = Registry([]);

    registry.on('enter', () => {});
    t.true(registry.handlers.enter.length === 1);

    registry.on('exit', () => {});
    t.true(registry.handlers.exit.length === 1);

    registry.off('enter', () => {});
    t.true(registry.handlers.enter.length === 0);

    registry.off('exit', () => {});
    t.true(registry.handlers.enter.length === 0);

});

test('Registry.off returns the registry', t => {
    let registry = Registry([]);
    t.deepEqual(registry.off('enter'), registry);
});
