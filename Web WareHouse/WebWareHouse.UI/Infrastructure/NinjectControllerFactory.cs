﻿using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebWareHouse.Model.Abstract;
using WebWareHouse.Model.Concrete;

namespace WebWareHouse.UI.Infrastructure
{
    public class NinjectControllerFactory: DefaultControllerFactory
    {
        IKernel ninjectKernel;

        public NinjectControllerFactory()
        {
            ninjectKernel = new StandardKernel();
            AddBindings();
        }

        protected override IController GetControllerInstance(System.Web.Routing.RequestContext requestContext, Type controllerType)
        {
            // получение объекта контроллера из контейнера
            // используя его тип
            return controllerType == null ? null : (IController)ninjectKernel.Get(controllerType);
            
        }

        void AddBindings()
        {
            ninjectKernel.Bind<IGoodsManager>().To<EFGoodsManager>();
        }
    }

}