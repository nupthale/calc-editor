import React, { useEffect, useState } from 'react'

import { updateFunctionParamCursor$ } from './observables';

import { functionParamsCount } from '../CalcEditorX2/lexer';
import { getToken } from './utils';

export default function CalcFunction() {
    const [functionType, setFunctionType] = useState('Date');
    const [activeIndex, setActiveIndex] = useState(0);
    const [errorInfo, setErrorInfo] = useState('');

    useEffect(() => {
        const subscription = updateFunctionParamCursor$.subscribe((caret) => {
            const currentToken = caret.editor.manager.currentToken
            console.log('asdklasjld', currentToken)
            console.log('asdklasjld cst', caret.editor.getAST())
            // 找到唯一对应的children的方法：
            // 1. tokenTypeIdx对应
            // 2. image对应
            const cst = caret.editor.getAST()
            if (cst.success) {
                console.log(cst.cst)
                setErrorInfo('')
                const { functionType,
                    actionIndex } = getToken(cst.cst, currentToken)
                setFunctionType(functionType)
                setActiveIndex(actionIndex)
                
                console.log('asdklasjld functionTypeAndactionIndex', functionType, actionIndex)
            } else {
                console.log('error')
                setErrorInfo(cst.errors[0].message)
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    return <div style={{display: 'flex', flexDirection: 'column'}}><div>
        function: {functionType} 
        {'('}{functionParamsCount[functionType]?.map((option, index) => 
                <div style={{background: activeIndex === index ? 'yellow' : '', display: 'inline'}}>{option},</div>
            )}{')'}
    </div>
    {errorInfo ? <div>CST Error: {errorInfo}</div> : null}
    </div>
}
