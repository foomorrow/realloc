import actionCreatorFactory from '../../src/actionCreatorFactory'
describe('create actionCreator', () => {
  it('should create a actionCreator', () => {
    var propsOfA = {b:1}
      , setterSpy = jasmine.createSpy('setterSpy')
      , actionFnSpy = jasmine.createSpy('actionFnSpy');
    var obj = {
      state:{
        a:propsOfA
      }
    }

    const {createAction, createActions} = actionCreatorFactory(() => obj.state, setterSpy)
    const action = createAction('$.a',(b) => {
      actionFnSpy(b)
      return {b:2}
    })
    action();
    expect(actionFnSpy).toHaveBeenCalledWith(propsOfA);
    expect(setterSpy).toHaveBeenCalledWith({a:{b:2}},[{pwd:['$'],name:'a',value:{b:1}}]);
  })
  it('deep update', () => {
    var propsOfA = {b:{c:1},d:{e:2}}
      , setterSpy = jasmine.createSpy('setterSpy')
    var nextState
    setterSpy.and.callFake((a) => {
      nextState = a
    })
    var obj = {
      state:{
        a:propsOfA
      }
    }

    const {createAction, createActions} = actionCreatorFactory(() => obj.state, setterSpy)
    const action = createAction('$.a.{0}.{1}', (k1, k2, c) => {
      return 2
    })
    action('b','c');
    expect(setterSpy).toHaveBeenCalled();
    expect(nextState.a.d).toBe(propsOfA.d);
    expect(nextState.a.b.c).toBe(2)
  })
  it('update nothing', () => {
    var propsOfA = {b:{c:1},d:{e:2}}
      , setterSpy = jasmine.createSpy('setterSpy')
    var nextState
    setterSpy.and.callFake((a) => {
      nextState = a
    })
    var obj = {
      state:{
        a:propsOfA
      }
    }
    const {createAction, createActions} = actionCreatorFactory(() => obj.state, setterSpy)
    const action = createAction('$', ($) => {})
    action()
    expect(setterSpy).not.toHaveBeenCalled();
  })
  it('reset root', () => {
    var a = {a:1}
      , b = {b:1}
      , setterSpy = jasmine.createSpy('setterSpy')
    var nextState
    setterSpy.and.callFake((a) => {
      nextState = a
    })
    const {createAction, createActions} = actionCreatorFactory(() => a, setterSpy)
    const action = createAction('$', ($) => {
      return b
    }, {})
    action()
    expect(setterSpy).toHaveBeenCalled()
    expect(nextState).not.toBe(a)
    expect(nextState).toBe(b)
  })
})
