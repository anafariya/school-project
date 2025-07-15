import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QuestionBuilder } from '@/Section/School/component/question-builder'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createForm, getCurrentUser } from '@/api'
import { toast } from '@/hooks/use-toast'
import { Question } from '@/lib/types'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'

type FormType = 'AwardPoints' | 'Feedback' | 'PointWithdraw' | 'DeductPoints' | 'AWARD POINTS WITH INDIVIDUALIZED EDUCTION PLAN (IEP)'

export default function FormBuilderTeacher() {
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState<FormType>('AwardPoints')
  const [grade, setGrade] = useState<number>(1)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSendEmail, setIsSendEmail] = useState({
    studentEmail: false,
    teacherEmail: false,
    schoolAdminEmail: false,
    parentEmail: false
  })

const clearForm = () => {
  setFormName('')
  setFormType('AwardPoints')
  setQuestions([])
}

useEffect(()=>{
  switch(formType){
    case 'AwardPoints':
      setIsSendEmail({
        studentEmail: true,
        teacherEmail: true,
        schoolAdminEmail: false,
        parentEmail: false
      })
      break
    case 'DeductPoints':
      setIsSendEmail({
        studentEmail: true,
        teacherEmail: false,
        schoolAdminEmail: false,
        parentEmail: true
      })
      break
    case 'PointWithdraw':
      setIsSendEmail({
        studentEmail: true,
        teacherEmail: true,
        schoolAdminEmail: false,
        parentEmail: false
      })
      break
    case 'Feedback':
      setIsSendEmail({
        studentEmail: false,
        teacherEmail: true,
        schoolAdminEmail: true,
        parentEmail: false
      })
      break
    case 'AWARD POINTS WITH INDIVIDUALIZED EDUCTION PLAN (IEP)':
      setIsSendEmail({
        studentEmail: true,
        teacherEmail: true,
        schoolAdminEmail: false,
        parentEmail: false
      })
      break

  }
},[formType])

const navigate = useNavigate()

  const handleCreateForm = async () => {
    // Validation
    if (!formName.trim()) {
      toast({ title: 'Error', description: 'Form name is required', variant: 'destructive' });
      return;
    }
    if (questions.length === 0) {
      toast({ title: 'Error', description: 'At least one question is required', variant: 'destructive' });
      return;
    }
    // Ensure IEP questions have required fields, and remove for others
    const processedQuestions = questions.map(q => {
      if (formType === 'AWARD POINTS WITH INDIVIDUALIZED EDUCTION PLAN (IEP)') {
        return {
          ...q,
          goal: q.goal || '',
          goalSummary: q.goalSummary || '',
          targetedBehaviour: q.targetedBehaviour || '',
        };
      } else {
        // Remove IEP-only fields for other forms
        const { goal, goalSummary, targetedBehaviour, ...rest } = q;
        return rest;
      }
    });
    const response = await createForm(
        {
          formName, 
          formType, 
          questions: processedQuestions, 
          isSpecial:false,
          grade: grade?.toString?.() || '',
          ...isSendEmail
        },
        localStorage.getItem('token')!
      )
    if(response.error){
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive'
      })   
    }else{
      toast({
        title: 'Success',
        description: 'Form Created Successfully'
      })
      clearForm()
      navigate('/teachers/viewforms')
    }
  }

  const addQuestion = (question: Question) => {
    // Ensure only valid type/pointsType values are used
    const validTypes = ['text', 'select', 'number'];
    const validPointsTypes = ['Award', 'Deduct', 'None'];
    const type = validTypes.includes(question.type) ? question.type : 'text';
    const pointsType = validPointsTypes.includes(question.pointsType) ? question.pointsType : 'None';
    setQuestions([...questions, { ...question, type, pointsType }]);
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q))
  }

  const getDefaultPointsType = (formType: FormType) => {
    switch(formType){
      case 'AwardPoints':
      case 'AWARD POINTS WITH INDIVIDUALIZED EDUCTION PLAN (IEP)':
        return 'Award'
      case 'Feedback':
        return 'None'
      case 'PointWithdraw':
        return 'Deduct'
      case 'DeductPoints':
        return 'Deduct'
    }
  }

  useEffect(()=>{
    const fetchTeacher = async () => {
      const res = await getCurrentUser();
      if(res.error){
        toast({
          title: 'Error',
          description: res.error,
          variant: 'destructive'
        })
    }else{
      setGrade(res.user.grade)
    }
  }

    fetchTeacher()
  },[])

  return (
    <div className="max-w-4xl p-4 space-y-6 bg-white rounded-lg shadow-md mx-auto mt-12">
      <h1 className="text-2xl font-bold">Create Form</h1>
      <div>
            <Label htmlFor="formName">Form Name</Label>
            <Input
              id="formName"
              name="formName"
              value={formName}
              placeholder='Enter Form Name'
              onChange={(e)=>setFormName(e.target.value)}
              required
            />
      </div>

      <div>
        <label htmlFor="formType" className="block text-sm font-medium text-gray-700 mb-1">
          Select Form Type
        </label>
        <Select onValueChange={(value: FormType) => setFormType(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select form type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AwardPoints">Award Points</SelectItem>
            <SelectItem value="Feedback">Feedback</SelectItem>
            <SelectItem value="PointWithdraw">Point Withdraw</SelectItem>
            <SelectItem value="DeductPoints">Deduct Points</SelectItem>
            <SelectItem value="AWARD POINTS WITH INDIVIDUALIZED EDUCTION PLAN (IEP)">
            Award Points with Individualized Education Plan (IEP)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      
      <div className='flex gap-2 text-sm'>
            <div className="flex items-center space-x-2">
              <Checkbox checked={isSendEmail.studentEmail} onCheckedChange={() => setIsSendEmail(prev => ({...prev, studentEmail: !prev.studentEmail}))}/>
              <p>Notify Student</p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={isSendEmail.teacherEmail} onCheckedChange={() => setIsSendEmail(prev => ({...prev, teacherEmail: !prev.teacherEmail}))}/>
              <p>Notify Teacher</p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={isSendEmail.schoolAdminEmail} onCheckedChange={() => setIsSendEmail(prev => ({...prev, schoolAdminEmail: !prev.schoolAdminEmail}))}/>
              <p>Notify Admin</p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={isSendEmail.parentEmail} onCheckedChange={() => setIsSendEmail(prev => ({...prev, parentEmail: !prev.parentEmail}))}/>
              <p>Notify Parents/Guardians</p>
            </div>
           
          </div>
      <div className="space-y-4">
        {questions.map((question, index) => (
          <>
          <p className='text-sm text-muted-foreground'>Question {index + 1}</p>
          <QuestionBuilder
            formType={formType}
            key={question.id}
            question={question}
            onUpdate={updateQuestion}
            onRemove={removeQuestion}
            />
          </>
        ))}
      </div>
      <Button
      variant='outline'
       onClick={() => addQuestion({
        id: Date.now().toString(),
        text: '',
        type: 'text',
        isCompulsory: false,
        maxPoints: 0,
        pointsType: getDefaultPointsType(formType)
      })}>
        Add Question
      </Button>
      <Button className='w-full bg-[#00a58c] hover:bg-[#00a58c]' onClick={handleCreateForm}>Create Form</Button>
    </div>
  )
}