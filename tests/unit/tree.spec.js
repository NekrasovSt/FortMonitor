import {shallowMount, mount} from '@vue/test-utils';
import Main from '@/components/Main.vue';
import * as api from '../../src/services/api';

describe('Main.vue', () => {
  it('вызов к api', done => {
    //jest.mock('../../src/services/api');
    api.getData = jest.fn().mockResolvedValue(Promise.resolve({}));

    let wrapper = mount(Main, {});

    expect(api.getData.mock.calls.length).toBe(1);

    setImmediate(() => {
      expect(wrapper.vm.tree).not.toBeNull();
      done();
    });
  });
  it('строим дерево', done => {
    api.getData = jest.fn().
        mockResolvedValue(Promise.resolve([{text: 'text1'}, {text: 'text2'}]));

    let wrapper = mount(Main, {});
    setImmediate(() => {
      expect(wrapper.findAll('li').length).toBe(2);
      done();
    });
  });
  it('установка активной ноды', () => {
    api.getData = jest.fn();
    let wrapper = mount(Main, {});
    expect(wrapper.vm.currentItem).toBeNull();
    expect(wrapper.find('ul.cell-container').exists()).not.toBeTruthy();

    wrapper.vm.nodeSelected({data: {type: 'company'}});
    expect(wrapper.find('ul.cell-container').exists()).toBeTruthy();
  });
  it('тип', () => {
    api.getData = jest.fn();
    let wrapper = mount(Main, {});

    expect(wrapper.vm.getTypeDescription('company')).toBe('Компания');
    expect(wrapper.vm.getTypeDescription('group')).toBe('Группа');
    expect(wrapper.vm.getTypeDescription('object')).toBe('Объект');
  });
  it('строим карту', () => {
    api.getData = jest.fn();
    let wrapper = mount(Main, {});

    expect(wrapper.find('div.leaflet-map-pane').exists()).toBeTruthy();
  });
  it('выбрали объект должен появится маркер', () => {
    api.getData = jest.fn();
    let wrapper = mount(Main, {});
    wrapper.vm.setPosition = jest.fn();
    wrapper.vm.nodeSelected({data: {lat: 1, lon: 1, type: 'object'}});
    expect(wrapper.vm.setPosition.mock.calls.length).toBe(1);
  });
  it('выбрали не объект должен удаляется маркер', () => {
    api.getData = jest.fn();
    let wrapper = mount(Main, {});
    wrapper.vm.setPosition = jest.fn();
    wrapper.vm.resetPosition = jest.fn();
    wrapper.vm.nodeSelected({data: {lat: 1, lon: 1, type: 'company'}});
    expect(wrapper.vm.setPosition.mock.calls.length).toBe(0);
    expect(wrapper.vm.resetPosition.mock.calls.length).toBe(1);
  });
});
