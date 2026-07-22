import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Plus, Trash2 } from 'lucide-react';

const AVAILABLE_LABELS = [
  { id: 'design', name: 'Design', bg: '#fdf2f8', text: '#db2777', border: '#db2777' },
  { id: 'development', name: 'Development', bg: '#f0fdf4', text: '#16a34a', border: '#16a34a' },
  { id: 'product', name: 'Product', bg: '#e0e7ff', text: '#4f46e5', border: '#4f46e5' },
  { id: 'marketing', name: 'Marketing', bg: '#fff7ed', text: '#ea580c', border: '#ea580c' },
  { id: 'business', name: 'Business', bg: '#f0fdfa', text: '#0d9488', border: '#0d9488' },
  { id: 'operation', name: 'Operation', bg: '#fefce8', text: '#ca8a04', border: '#ca8a04' },
];


const ASSIGNEES = ['Taha Hosseinipour', 'S.H Mostafavi', 'Milad Mirzaei'];


const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('Please enter title!'),
  description: Yup.string().trim(),
  subtasks: Yup.array().of(Yup.string().trim()),
  labels: Yup.array(),
  assignee: Yup.string()
    .required('Please select (Assignee)! '),
});

const initialFormValues = {
  title: '',
  description: '',
  subtasks: [''],
  labels: [],
  assignee: '',
};

export default function TaskForm({ onAddTask }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm transition-all duration-300">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-slate-900 rounded-full"></span>
        Create Card
      </h2>

      <Formik
        initialValues={initialFormValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          onAddTask(values); 
          resetForm();       
        }}
      >
        {({ values, setFieldValue, resetForm }) => (
          <Form className="space-y-5">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Title <span className="text-rose-500">*</span>
              </label>
              <Field
                name="title"
                type="text"
                placeholder="Task title..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all duration-200 bg-slate-50/50 focus:bg-white"
              />
              <ErrorMessage name="title" component="p" className="text-rose-500 text-xs mt-1 font-medium" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</label>
              <Field
                name="description"
                as="textarea"
                rows="3"
                placeholder="Add descriptions..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-sm resize-none"
              />
            </div>

           
            <div>
              <FieldArray name="subtasks">
                {({ push, remove }) => (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subtask</label>
                      <button
                        type="button"
                        onClick={() => push('')}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 px-3 rounded-lg transition-all duration-200 active:scale-95"
                        >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {values.subtasks.map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Field
                            name={`subtasks.${index}`}
                            type="text"
                            placeholder="Subtask title..."
                            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                          {values.subtasks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FieldArray>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Label</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LABELS.map((label) => {
                  const isSelected = values.labels.includes(label.id);
                  return (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() => {
                        const nextLabels = isSelected
                          ? values.labels.filter(id => id !== label.id)
                          : [...values.labels, label.id];
                        setFieldValue('labels', nextLabels);
                      }}
                     style={{
  backgroundColor: label.bg,
  color: label.text,
  borderColor: isSelected ? label.border : 'transparent',
  boxShadow: isSelected ? `0 4px 12px ${label.bg}` : 'none'
}}
className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-sm ${
  isSelected ? 'scale-105 font-extrabold' : 'hover:opacity-80 active:scale-95'
}`}
                    >
                      {label.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Assignee <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2">
                {ASSIGNEES.map((person) => (
                  <label
                    key={person}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Field
                      type="radio"
                      name="assignee"
                      value={person}
                      className="w-4 h-4 text-slate-900 focus:ring-slate-900 border-slate-300"
                    />
                    <span className="text-sm font-medium text-slate-700">{person}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage name="assignee" component="p" className="text-rose-500 text-xs mt-1 font-medium" />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => resetForm()}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Clear All
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-950 text-white text-sm font-bold hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-950/20 transition-all duration-200 active:scale-95"
              >
                Create Card
              </button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}